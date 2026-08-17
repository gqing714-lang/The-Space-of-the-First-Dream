import { getStore } from "@edgeone/pages-blob";

type Role = "admin" | "member";

type StoredUser = {
  id: "qing" | "friend";
  displayName: string;
  role: Role;
  initial: string;
  color: string;
  signature?: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
};

type PublicUser = Pick<StoredUser, "id" | "displayName" | "role" | "initial" | "color"> & { signature: string };

type StoredCharacter = {
  id: string;
  name: string;
  note: string;
  greeting: string;
  color: string;
  initial: string;
  enabled: boolean;
  book: string;
  createdAt: string;
};

type Session = {
  userId: StoredUser["id"];
  expiresAt: string;
};

type StoredPost = {
  id: string;
  authorId: string;
  author: string;
  initial: string;
  role: string;
  color: string;
  text: string;
  createdAt: string;
  likedBy: { id: string; name: string }[];
  comments: { id: string; authorId: string; name: string; text: string; createdAt: string }[];
};

type Actor = {
  id: string;
  name: string;
  initial: string;
  role: string;
  color: string;
};

const encoder = new TextEncoder();
const store = getStore("yimengjian-data");
const sessionCookie = "yimeng_session";
const sessionSeconds = 60 * 60 * 24 * 30;
const defaultCharacters: StoredCharacter[] = [
  { id: "nanzhi", name: "南枝", note: "温柔、敏锐，喜欢记录雨天与旧物。", greeting: "", color: "#d7728d", initial: "枝", enabled: true, book: "雾港旧闻", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "yuke", name: "雨客", note: "寡言的夜行者，说话短而有画面感。", greeting: "", color: "#5f6f88", initial: "雨", enabled: true, book: "共用世界书", createdAt: "2026-01-01T00:00:01.000Z" },
  { id: "shisui", name: "时穗", note: "热衷甜点和植物，总能发现小小的好事。", greeting: "", color: "#b784a7", initial: "穗", enabled: true, book: "无绑定", createdAt: "2026-01-01T00:00:02.000Z" },
];

function responseJson(data: unknown, status = 200, extraHeaders?: HeadersInit) {
  const headers = new Headers(extraHeaders);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(JSON.stringify(data), { status, headers });
}

function error(message: string, status = 400) {
  return responseJson({ error: message }, status);
}

async function bodyJson(request: Request) {
  const raw = await request.text();
  if (raw.length > 40_000) throw new Error("请求内容过长");
  if (!raw) return {} as Record<string, unknown>;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    throw new Error("请求格式不正确");
  }
}

function parseCookies(request: Request) {
  const cookies: Record<string, string> = {};
  for (const part of (request.headers.get("Cookie") || "").split(";")) {
    const index = part.indexOf("=");
    if (index < 0) continue;
    cookies[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim());
  }
  return cookies;
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex: string) {
  const pairs = hex.match(/.{1,2}/g) || [];
  return new Uint8Array(pairs.map(pair => Number.parseInt(pair, 16)));
}

function randomHex(length = 32) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return bytesToHex(new Uint8Array(digest));
}

async function derivePassword(password: string, salt: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: hexToBytes(salt), iterations: 120_000 },
    key,
    256,
  );
  return bytesToHex(new Uint8Array(bits));
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return result === 0;
}

function publicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    displayName: user.displayName,
    role: user.role,
    initial: user.initial,
    color: user.color,
    signature: user.signature || "",
  };
}

async function getUser(id: string) {
  return await store.get(`users/${id}.json`, { type: "json", consistency: "strong" }) as StoredUser | null;
}

async function currentUser(request: Request) {
  const token = parseCookies(request)[sessionCookie];
  if (!token || token.length < 40) return null;
  const tokenHash = await sha256(token);
  const session = await store.get(`sessions/${tokenHash}.json`, { type: "json", consistency: "strong" }) as Session | null;
  if (!session) return null;
  if (Date.parse(session.expiresAt) <= Date.now()) {
    await store.delete(`sessions/${tokenHash}.json`);
    return null;
  }
  return await getUser(session.userId);
}

async function createSession(user: StoredUser) {
  const token = randomHex();
  const tokenHash = await sha256(token);
  const expiresAt = new Date(Date.now() + sessionSeconds * 1000).toISOString();
  await store.setJSON(`sessions/${tokenHash}.json`, { userId: user.id, expiresAt } satisfies Session);
  return {
    token,
    cookie: `${sessionCookie}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${sessionSeconds}`,
  };
}

function ensureSameOrigin(request: Request) {
  const fetchSite = request.headers.get("Sec-Fetch-Site");
  if (fetchSite === "cross-site") return false;
  return true;
}

function cleanName(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  return value.trim().replace(/[<>\r\n]/g, "").slice(0, 20) || fallback;
}

function cleanText(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

function validPassword(value: unknown) {
  return typeof value === "string" && value.length >= 6 && value.length <= 128;
}

function actorFrom(user: StoredUser, candidate: unknown): Actor {
  if (user.role === "admin" && candidate && typeof candidate === "object") {
    const raw = candidate as Record<string, unknown>;
    const name = cleanName(raw.name, "角色");
    const color = typeof raw.color === "string" && /^#[0-9a-f]{6}$/i.test(raw.color) ? raw.color : "#8d7697";
    return {
      id: typeof raw.id === "string" ? raw.id.slice(0, 80) : `character-${name}`,
      name,
      initial: cleanName(raw.initial, name.slice(0, 1)).slice(0, 2),
      role: "AI 成员",
      color,
    };
  }
  return {
    id: user.id,
    name: user.displayName,
    initial: user.initial,
    role: "真人成员",
    color: user.color,
  };
}

function publicPost(post: StoredPost) {
  return {
    id: post.id,
    author: post.author,
    initial: post.initial,
    role: post.role,
    color: post.color,
    text: post.text,
    createdAt: post.createdAt,
    likedBy: post.likedBy.map(item => item.name),
    comments: post.comments.map(item => ({ name: item.name, text: item.text, createdAt: item.createdAt })),
  };
}

async function status() {
  const setup = await store.get("config/setup.json", { type: "json", consistency: "strong" }) as { initialized?: boolean } | null;
  if (!setup?.initialized) return responseJson({ initialized: false, users: [] });
  const [admin, friend] = await Promise.all([getUser("qing"), getUser("friend")]);
  return responseJson({ initialized: true, users: [admin, friend].filter(Boolean).map(user => publicUser(user as StoredUser)) });
}

async function setup(request: Request) {
  const existing = await store.get("config/setup.json", { type: "json", consistency: "strong" }) as { initialized?: boolean } | null;
  if (existing?.initialized) return error("一梦间已经完成初始化", 409);
  const body = await bodyJson(request);
  if (!validPassword(body.adminPassword) || !validPassword(body.friendPassword)) return error("两组密码都至少需要 6 个字符");

  const createdAt = new Date().toISOString();
  const adminSalt = randomHex(16);
  const friendSalt = randomHex(16);
  const [adminHash, friendHash] = await Promise.all([
    derivePassword(body.adminPassword as string, adminSalt),
    derivePassword(body.friendPassword as string, friendSalt),
  ]);
  const adminName = cleanName(body.adminName, "青");
  const friendName = cleanName(body.friendName, "好友");
  const admin: StoredUser = {
    id: "qing",
    displayName: adminName,
    role: "admin",
    initial: adminName.slice(0, 1),
    color: "#c46483",
    signature: "",
    passwordHash: adminHash,
    passwordSalt: adminSalt,
    createdAt,
  };
  const friend: StoredUser = {
    id: "friend",
    displayName: friendName,
    role: "member",
    initial: friendName.slice(0, 1),
    color: "#7186a2",
    signature: "",
    passwordHash: friendHash,
    passwordSalt: friendSalt,
    createdAt,
  };

  await Promise.all([
    store.setJSON("users/qing.json", admin, { onlyIfNew: true }),
    store.setJSON("users/friend.json", friend, { onlyIfNew: true }),
  ]);
  await store.setJSON("config/setup.json", { initialized: true, createdAt }, { onlyIfNew: true });
  const session = await createSession(admin);
  return responseJson({ user: publicUser(admin), users: [publicUser(admin), publicUser(friend)] }, 201, { "Set-Cookie": session.cookie });
}

async function updateProfile(request: Request) {
  const user = await currentUser(request);
  if (!user) return error("请先登录", 401);
  const body = await bodyJson(request);
  if (typeof body.signature !== "string") return error("签名格式不正确");
  user.signature = cleanText(body.signature, 120);
  await store.setJSON(`users/${user.id}.json`, user);
  return responseJson({ user: publicUser(user) });
}

async function readCharacters() {
  let characters = await store.get("characters/index.json", { type: "json", consistency: "strong" }) as StoredCharacter[] | null;
  if (characters === null) {
    await store.setJSON("characters/index.json", defaultCharacters, { onlyIfNew: true });
    characters = await store.get("characters/index.json", { type: "json", consistency: "strong" }) as StoredCharacter[] | null;
  }
  return Array.isArray(characters) ? characters : [];
}

async function characters(request: Request) {
  const user = await currentUser(request);
  if (!user) return error("请先登录", 401);
  return responseJson({ characters: await readCharacters() });
}

function characterPayload(body: Record<string, unknown>, existing?: StoredCharacter): StoredCharacter {
  const name = cleanName(body.name, existing?.name || "未命名角色");
  const color = typeof body.color === "string" && /^#[0-9a-f]{6}$/i.test(body.color)
    ? body.color
    : existing?.color || "#8d7697";
  return {
    id: existing?.id || `char-${Date.now().toString(36)}-${randomHex(4)}`,
    name,
    note: cleanText(body.note, 8_000) || existing?.note || "还没有填写角色设定。",
    greeting: cleanText(body.greeting, 1_000),
    color,
    initial: name.slice(0, 2),
    enabled: typeof body.enabled === "boolean" ? body.enabled : existing?.enabled ?? true,
    book: cleanName(body.book, existing?.book || "无绑定"),
    createdAt: existing?.createdAt || new Date().toISOString(),
  };
}

async function createCharacter(request: Request) {
  const user = await currentUser(request);
  if (!user) return error("请先登录", 401);
  if (user.role !== "admin") return error("只有管理员可以管理 AI 成员", 403);
  const body = await bodyJson(request);
  if (!cleanText(body.name, 20)) return error("请填写角色名");
  const list = await readCharacters();
  const character = characterPayload(body);
  await store.setJSON("characters/index.json", [...list, character]);
  return responseJson({ character }, 201);
}

async function characterAction(request: Request) {
  const user = await currentUser(request);
  if (!user) return error("请先登录", 401);
  if (user.role !== "admin") return error("只有管理员可以管理 AI 成员", 403);
  const body = await bodyJson(request);
  const characterId = typeof body.characterId === "string" ? body.characterId : "";
  const list = await readCharacters();
  const existing = list.find(item => item.id === characterId);
  if (!existing) return error("这个角色已经不存在了", 404);

  if (body.action === "delete") {
    await store.setJSON("characters/index.json", list.filter(item => item.id !== characterId));
    return responseJson({ ok: true });
  }
  if (body.action !== "update") return error("未知操作");
  const character = characterPayload(body, existing);
  await store.setJSON("characters/index.json", list.map(item => item.id === characterId ? character : item));
  return responseJson({ character });
}

async function login(request: Request) {
  const body = await bodyJson(request);
  const id = body.userId === "friend" ? "friend" : body.userId === "qing" ? "qing" : null;
  if (!id || typeof body.password !== "string") return error("请选择身份并输入密码");
  const user = await getUser(id);
  if (!user) return error("找不到这个成员", 404);
  const supplied = await derivePassword(body.password, user.passwordSalt);
  if (!constantTimeEqual(supplied, user.passwordHash)) return error("密码不正确", 401);
  const session = await createSession(user);
  return responseJson({ user: publicUser(user) }, 200, { "Set-Cookie": session.cookie });
}

async function logout(request: Request) {
  const token = parseCookies(request)[sessionCookie];
  if (token) await store.delete(`sessions/${await sha256(token)}.json`);
  return responseJson({ ok: true }, 200, { "Set-Cookie": `${sessionCookie}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0` });
}

async function session(request: Request) {
  const user = await currentUser(request);
  if (!user) return error("尚未登录", 401);
  return responseJson({ user: publicUser(user) });
}

async function feed(request: Request) {
  const user = await currentUser(request);
  if (!user) return error("请先登录", 401);
  const { blobs } = await store.list({ prefix: "posts/", consistency: "strong" });
  const posts = (await Promise.all(blobs.slice(-300).map(item => store.get(item.key, { type: "json", consistency: "strong" }))))
    .filter(Boolean) as StoredPost[];
  posts.sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
  return responseJson({ posts: posts.map(publicPost) });
}

async function createPost(request: Request) {
  const user = await currentUser(request);
  if (!user) return error("请先登录", 401);
  const body = await bodyJson(request);
  const text = typeof body.text === "string" ? body.text.trim().slice(0, 600) : "";
  if (!text) return error("动态内容不能为空");
  const actor = actorFrom(user, body.actor);
  const createdAt = new Date().toISOString();
  const id = `${Date.now().toString(36)}-${randomHex(5)}`;
  const post: StoredPost = {
    id,
    authorId: actor.id,
    author: actor.name,
    initial: actor.initial,
    role: actor.role,
    color: actor.color,
    text,
    createdAt,
    likedBy: [],
    comments: [],
  };
  await store.setJSON(`posts/${id}.json`, post, { onlyIfNew: true });
  return responseJson({ post: publicPost(post) }, 201);
}

async function postAction(request: Request) {
  const user = await currentUser(request);
  if (!user) return error("请先登录", 401);
  const body = await bodyJson(request);
  const postId = typeof body.postId === "string" ? body.postId : "";
  if (!/^[a-z0-9-]{8,80}$/i.test(postId)) return error("动态编号无效");
  const key = `posts/${postId}.json`;
  const post = await store.get(key, { type: "json", consistency: "strong" }) as StoredPost | null;
  if (!post) return error("这条动态已经不存在了", 404);

  if (body.action === "like") {
    const liked = post.likedBy.some(item => item.id === user.id);
    post.likedBy = liked
      ? post.likedBy.filter(item => item.id !== user.id)
      : [...post.likedBy, { id: user.id, name: user.displayName }];
  } else if (body.action === "comment") {
    const text = typeof body.text === "string" ? body.text.trim().slice(0, 300) : "";
    if (!text) return error("回应内容不能为空");
    const actor = actorFrom(user, body.actor);
    post.comments.push({
      id: `${Date.now().toString(36)}-${randomHex(4)}`,
      authorId: actor.id,
      name: actor.name,
      text,
      createdAt: new Date().toISOString(),
    });
  } else {
    return error("未知操作");
  }

  await store.setJSON(key, post);
  return responseJson({ post: publicPost(post) });
}

export async function onRequest({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    if (request.method === "GET" && path === "/api/status") return await status();
    if (request.method === "GET" && path === "/api/session") return await session(request);
    if (request.method === "GET" && path === "/api/feed") return await feed(request);
    if (request.method === "GET" && path === "/api/characters") return await characters(request);

    if (request.method !== "GET" && !ensureSameOrigin(request)) return error("请求来源无效", 403);
    if (request.method === "POST" && path === "/api/setup") return await setup(request);
    if (request.method === "POST" && path === "/api/login") return await login(request);
    if (request.method === "POST" && path === "/api/logout") return await logout(request);
    if (request.method === "POST" && path === "/api/profile") return await updateProfile(request);
    if (request.method === "POST" && path === "/api/characters") return await createCharacter(request);
    if (request.method === "POST" && path === "/api/character-action") return await characterAction(request);
    if (request.method === "POST" && path === "/api/posts") return await createPost(request);
    if (request.method === "POST" && path === "/api/post-action") return await postAction(request);
    return error("接口不存在", 404);
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "服务器暂时无法处理请求";
    return error(message, 500);
  }
}
