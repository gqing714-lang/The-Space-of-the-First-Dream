import { getStore } from "@edgeone/pages-blob";

type Role = "admin" | "member";

type StoredUser = {
  id: "qing" | "friend";
  displayName: string;
  role: Role;
  initial: string;
  color: string;
  signature?: string;
  avatarVersion?: string;
  avatarContentType?: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
};

type PublicUser = Pick<StoredUser, "id" | "displayName" | "role" | "initial" | "color"> & { signature: string; avatarUrl?: string };

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
  avatarVersion?: string;
  avatarContentType?: string;
};

type PublicCharacter = Omit<StoredCharacter, "avatarVersion" | "avatarContentType"> & { avatarUrl?: string };

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
  imageVersion?: string;
  imageContentType?: string;
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

type AiConfig = {
  baseUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  updatedAt: string;
};

type WorldEntry = {
  id: string;
  title: string;
  scope: string;
  trigger: string;
  keys: string;
  position: string;
  enabled: boolean;
  content: string;
};

type GeneratedDraft = {
  characterId: string;
  author: string;
  initial: string;
  color: string;
  text: string;
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
const defaultWorldEntries: WorldEntry[] = [
  { id: "w1", title: "雾港的雨季", scope: "全局", trigger: "常驻", keys: "", position: "角色设定之后", enabled: true, content: "雾港一年中大半时间有雨，居民习惯在窗边悬一盏小灯。" },
  { id: "w2", title: "旧车站", scope: "南枝", trigger: "关键词", keys: "车站, 月台, 末班车", position: "对话前 · 深度 2", enabled: true, content: "雾港旧车站已经停用，南枝偶尔会去那里收集遗落的车票。" },
  { id: "w3", title: "甜食约定", scope: "时穗", trigger: "关键词", keys: "蛋糕, 奶茶, 甜点", position: "对话前 · 深度 1", enabled: false, content: "时穗答应每发现一家新甜品店，就给朋友们写一份很短的测评。" },
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

function publicUser(user: StoredUser, includeAvatar = true): PublicUser {
  return {
    id: user.id,
    displayName: user.displayName,
    role: user.role,
    initial: user.initial,
    color: user.color,
    signature: user.signature || "",
    ...(includeAvatar && user.avatarVersion ? { avatarUrl: `/api/avatar/user/${user.id}?v=${encodeURIComponent(user.avatarVersion)}` } : {}),
  };
}

function publicCharacter(character: StoredCharacter): PublicCharacter {
  return {
    id: character.id,
    name: character.name,
    note: character.note,
    greeting: character.greeting,
    color: character.color,
    initial: character.initial,
    enabled: character.enabled,
    book: character.book,
    createdAt: character.createdAt,
    ...(character.avatarVersion ? { avatarUrl: `/api/avatar/character/${encodeURIComponent(character.id)}?v=${encodeURIComponent(character.avatarVersion)}` } : {}),
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

function finiteNumber(value: unknown, fallback: number, minimum: number, maximum: number) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? Math.min(maximum, Math.max(minimum, parsed)) : fallback;
}

function cleanBaseUrl(value: unknown) {
  if (typeof value !== "string") throw new Error("请填写 API Base URL");
  let url: URL;
  try { url = new URL(value.trim()); } catch { throw new Error("API Base URL 格式不正确"); }
  if (url.protocol !== "https:") throw new Error("API 地址必须使用 HTTPS");
  const host = url.hostname.toLowerCase();
  const blocked = host === "localhost" || host === "::1" || host.endsWith(".local") || /^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host);
  if (blocked) throw new Error("不能连接本地或内网 API 地址");
  url.hash = "";
  url.search = "";
  return url.toString().replace(/\/+$/, "");
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
    authorId: post.authorId,
    author: post.author,
    initial: post.initial,
    role: post.role,
    color: post.color,
    text: post.text,
    createdAt: post.createdAt,
    ...(post.imageVersion ? { image: `/api/post-image/${encodeURIComponent(post.id)}?v=${encodeURIComponent(post.imageVersion)}` } : {}),
    likedBy: post.likedBy.map(item => item.name),
    comments: post.comments.map(item => ({ name: item.name, text: item.text, createdAt: item.createdAt })),
  };
}

async function status() {
  const setup = await store.get("config/setup.json", { type: "json", consistency: "strong" }) as { initialized?: boolean } | null;
  if (!setup?.initialized) return responseJson({ initialized: false, users: [] });
  const [admin, friend] = await Promise.all([getUser("qing"), getUser("friend")]);
  return responseJson({ initialized: true, users: [admin, friend].filter(Boolean).map(user => publicUser(user as StoredUser, false)) });
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
  return responseJson({ characters: (await readCharacters()).map(publicCharacter) });
}

async function members(request: Request) {
  const user = await currentUser(request);
  if (!user) return error("请先登录", 401);
  const [admin, friend] = await Promise.all([getUser("qing"), getUser("friend")]);
  return responseJson({ users: [admin, friend].filter(Boolean).map(item => publicUser(item as StoredUser)) });
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
    ...(existing?.avatarVersion ? { avatarVersion: existing.avatarVersion, avatarContentType: existing.avatarContentType } : {}),
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
  return responseJson({ character: publicCharacter(character) }, 201);
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
    if (existing.avatarVersion) await store.delete(avatarKey("character", existing.id));
    const entries = await readWorldEntries();
    await Promise.all([
      store.setJSON("characters/index.json", list.filter(item => item.id !== characterId)),
      store.setJSON("worldbook/index.json", entries.filter(entry => entry.scope !== existing.name)),
    ]);
    return responseJson({ ok: true });
  }
  if (body.action !== "update") return error("未知操作");
  const character = characterPayload(body, existing);
  const entries = character.name === existing.name ? null : await readWorldEntries();
  await Promise.all([
    store.setJSON("characters/index.json", list.map(item => item.id === characterId ? character : item)),
    ...(entries ? [store.setJSON("worldbook/index.json", entries.map(entry => entry.scope === existing.name ? { ...entry, scope: character.name } : entry))] : []),
  ]);
  return responseJson({ character: publicCharacter(character) });
}

function avatarKey(kind: "user" | "character", id: string) {
  return `avatars/${kind}/${id}.bin`;
}

async function uploadAvatar(request: Request) {
  const user = await currentUser(request);
  if (!user) return error("请先登录", 401);
  const form = await request.formData();
  const kind = form.get("kind");
  const id = form.get("id");
  const file = form.get("file");
  if ((kind !== "user" && kind !== "character") || typeof id !== "string") return error("头像目标无效");
  if (typeof file === "string" || !file) return error("请选择头像图片");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return error("只支持 JPG、PNG 或 WebP 图片");
  if (file.size > 1_500_000) return error("处理后的头像不能超过 1.5MB");
  const version = `${Date.now().toString(36)}-${randomHex(3)}`;

  if (kind === "user") {
    if (id !== user.id) return error("只能修改自己的头像", 403);
    await store.set(avatarKey("user", user.id), await file.arrayBuffer());
    user.avatarVersion = version;
    user.avatarContentType = file.type;
    await store.setJSON(`users/${user.id}.json`, user);
    return responseJson({ user: publicUser(user) });
  }

  if (user.role !== "admin") return error("只有管理员可以修改 AI 头像", 403);
  const list = await readCharacters();
  const character = list.find(item => item.id === id);
  if (!character) return error("这个角色已经不存在了", 404);
  await store.set(avatarKey("character", character.id), await file.arrayBuffer());
  character.avatarVersion = version;
  character.avatarContentType = file.type;
  await store.setJSON("characters/index.json", list);
  return responseJson({ character: publicCharacter(character) });
}

async function serveAvatar(request: Request, path: string) {
  const user = await currentUser(request);
  if (!user) return error("请先登录", 401);
  const match = /^\/api\/avatar\/(user|character)\/([a-z0-9-]{1,100})$/i.exec(path);
  if (!match) return error("头像地址无效", 404);
  const kind = match[1] as "user" | "character";
  const id = match[2];
  let contentType = "image/webp";
  if (kind === "user") {
    const owner = await getUser(id);
    if (!owner?.avatarVersion) return error("头像不存在", 404);
    contentType = owner.avatarContentType || contentType;
  } else {
    const character = (await readCharacters()).find(item => item.id === id);
    if (!character?.avatarVersion) return error("头像不存在", 404);
    contentType = character.avatarContentType || contentType;
  }
  const bytes = await store.get(avatarKey(kind, id), { type: "arrayBuffer", consistency: "strong" });
  if (!bytes) return error("头像不存在", 404);
  return new Response(bytes, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
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
  const contentType = request.headers.get("Content-Type") || "";
  let body: Record<string, unknown> = {};
  let imageFile: File | null = null;
  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    body = { text: form.get("text") };
    const entry = form.get("image");
    if (entry && typeof entry !== "string") imageFile = entry;
  } else {
    body = await bodyJson(request);
  }
  const text = typeof body.text === "string" ? body.text.trim().slice(0, 600) : "";
  if (!text && !imageFile) return error("请写点内容或选择一张图片");
  if (imageFile && !["image/jpeg", "image/png", "image/webp"].includes(imageFile.type)) return error("动态图片只支持 JPG、PNG 或 WebP");
  if (imageFile && imageFile.size > 3_000_000) return error("处理后的动态图片不能超过 3MB");
  const actor = actorFrom(user, contentType.includes("multipart/form-data") ? null : body.actor);
  const createdAt = new Date().toISOString();
  const id = `${Date.now().toString(36)}-${randomHex(5)}`;
  const imageVersion = imageFile ? `${Date.now().toString(36)}-${randomHex(3)}` : undefined;
  const post: StoredPost = {
    id,
    authorId: actor.id,
    author: actor.name,
    initial: actor.initial,
    role: actor.role,
    color: actor.color,
    text,
    createdAt,
    ...(imageVersion ? { imageVersion, imageContentType: imageFile?.type || "image/webp" } : {}),
    likedBy: [],
    comments: [],
  };
  if (imageFile) await store.set(`post-images/${id}.bin`, await imageFile.arrayBuffer());
  await store.setJSON(`posts/${id}.json`, post, { onlyIfNew: true });
  return responseJson({ post: publicPost(post) }, 201);
}

async function servePostImage(request: Request, path: string) {
  const user = await currentUser(request);
  if (!user) return error("请先登录", 401);
  const match = /^\/api\/post-image\/([a-z0-9-]{8,80})$/i.exec(path);
  if (!match) return error("动态图片地址无效", 404);
  const post = await store.get(`posts/${match[1]}.json`, { type: "json", consistency: "strong" }) as StoredPost | null;
  if (!post?.imageVersion) return error("动态图片不存在", 404);
  const bytes = await store.get(`post-images/${post.id}.bin`, { type: "arrayBuffer", consistency: "strong" });
  if (!bytes) return error("动态图片不存在", 404);
  return new Response(bytes, {
    headers: {
      "Content-Type": post.imageContentType || "image/webp",
      "Cache-Control": "private, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
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

  if (body.action === "delete") {
    if (user.role !== "admin" && post.authorId !== user.id) return error("只能删除自己发布的动态", 403);
    if (post.imageVersion) await store.delete(`post-images/${post.id}.bin`);
    await store.delete(key);
    return responseJson({ deletedId: post.id });
  }

  if (body.action === "edit") {
    if (user.role !== "admin" && post.authorId !== user.id) return error("只能编辑自己发布的动态", 403);
    const text = typeof body.text === "string" ? body.text.trim().slice(0, 600) : "";
    if (!text && !post.imageVersion) return error("动态内容不能为空");
    post.text = text;
    await store.setJSON(key, post);
    return responseJson({ post: publicPost(post) });
  }

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

async function readAiConfig() {
  return await store.get("config/ai.json", { type: "json", consistency: "strong" }) as AiConfig | null;
}

function publicAiConfig(config: AiConfig | null) {
  return {
    baseUrl: config?.baseUrl || "",
    model: config?.model || "",
    temperature: config?.temperature ?? 0.85,
    maxTokens: config?.maxTokens ?? 1800,
    hasApiKey: Boolean(config?.apiKey),
  };
}

function chatEndpoint(baseUrl: string) {
  return baseUrl.endsWith("/chat/completions") ? baseUrl : `${baseUrl}/chat/completions`;
}

function modelError(payload: unknown, status: number) {
  if (payload && typeof payload === "object") {
    const root = payload as Record<string, unknown>;
    const detail = root.error && typeof root.error === "object" ? root.error as Record<string, unknown> : root;
    if (typeof detail.message === "string") return cleanText(detail.message, 240);
  }
  return `模型服务返回了 ${status}`;
}

async function callModel(config: AiConfig, messages: { role: "system" | "user"; content: string }[], maxTokens = config.maxTokens) {
  let response: Response;
  try {
    response = await fetch(chatEndpoint(config.baseUrl), {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${config.apiKey}` },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: config.temperature,
        max_tokens: maxTokens,
      }),
      signal: AbortSignal.timeout(60_000),
    });
  } catch (caught) {
    if (caught instanceof Error && caught.name === "TimeoutError") throw new Error("模型请求超时，请稍后再试");
    throw new Error("无法连接模型服务，请检查 API 地址");
  }
  const payload = await response.json().catch(() => null) as Record<string, unknown> | null;
  if (!response.ok) throw new Error(modelError(payload, response.status));
  const choices = payload && Array.isArray(payload.choices) ? payload.choices : [];
  const first = choices[0] && typeof choices[0] === "object" ? choices[0] as Record<string, unknown> : null;
  const message = first?.message && typeof first.message === "object" ? first.message as Record<string, unknown> : null;
  const content = typeof message?.content === "string" ? message.content.trim() : "";
  if (!content) throw new Error("模型没有返回文字内容");
  return content;
}

async function aiConfig(request: Request) {
  const user = await currentUser(request);
  if (!user) return error("请先登录", 401);
  if (user.role !== "admin") return error("只有管理员可以管理 API", 403);
  if (request.method === "GET") return responseJson({ config: publicAiConfig(await readAiConfig()) });

  const body = await bodyJson(request);
  const existing = await readAiConfig();
  const apiKey = typeof body.apiKey === "string" && body.apiKey.trim() ? body.apiKey.trim().slice(0, 500) : existing?.apiKey || "";
  const model = cleanText(body.model, 120) || existing?.model || "";
  if (!apiKey) return error("请填写 API Key");
  if (!model) return error("请填写模型名称");
  const config: AiConfig = {
    baseUrl: cleanBaseUrl(body.baseUrl || existing?.baseUrl),
    apiKey,
    model,
    temperature: finiteNumber(body.temperature, existing?.temperature ?? 0.85, 0, 2),
    maxTokens: Math.round(finiteNumber(body.maxTokens, existing?.maxTokens ?? 1800, 100, 8000)),
    updatedAt: new Date().toISOString(),
  };
  const answer = await callModel(config, [
    { role: "system", content: "你正在进行连接测试。" },
    { role: "user", content: "只回复：连接成功" },
  ], 20);
  await store.setJSON("config/ai.json", config);
  return responseJson({ config: publicAiConfig(config), answer: cleanText(answer, 60) });
}

async function readWorldEntries() {
  let entries = await store.get("worldbook/index.json", { type: "json", consistency: "strong" }) as WorldEntry[] | null;
  if (entries === null) {
    await store.setJSON("worldbook/index.json", defaultWorldEntries, { onlyIfNew: true });
    entries = await store.get("worldbook/index.json", { type: "json", consistency: "strong" }) as WorldEntry[] | null;
  }
  return Array.isArray(entries) ? entries : [];
}

function worldPayload(body: Record<string, unknown>, existing?: WorldEntry): WorldEntry {
  return {
    id: existing?.id || `world-${Date.now().toString(36)}-${randomHex(4)}`,
    title: cleanText(body.title, 80) || existing?.title || "未命名条目",
    scope: cleanName(body.scope, existing?.scope || "全局"),
    trigger: body.trigger === "常驻" ? "常驻" : "关键词",
    keys: cleanText(body.keys, 300),
    position: cleanText(body.position, 80) || existing?.position || "角色设定之后",
    enabled: typeof body.enabled === "boolean" ? body.enabled : existing?.enabled ?? true,
    content: cleanText(body.content, 8_000) || existing?.content || "等待补充内容",
  };
}

async function worldbook(request: Request) {
  const user = await currentUser(request);
  if (!user) return error("请先登录", 401);
  if (user.role !== "admin") return error("只有管理员可以管理世界书", 403);
  const entries = await readWorldEntries();
  if (request.method === "GET") return responseJson({ entries });
  const body = await bodyJson(request);
  if (body.action === "create") {
    if (!cleanText(body.title, 80)) return error("请填写条目名称");
    const entry = worldPayload(body);
    await store.setJSON("worldbook/index.json", [...entries, entry]);
    return responseJson({ entry }, 201);
  }
  const id = typeof body.id === "string" ? body.id : "";
  const existing = entries.find(entry => entry.id === id);
  if (!existing) return error("这个世界书条目已经不存在了", 404);
  if (body.action === "delete") {
    await store.setJSON("worldbook/index.json", entries.filter(entry => entry.id !== id));
    return responseJson({ deletedId: id });
  }
  if (body.action !== "update") return error("未知操作");
  const entry = worldPayload(body, existing);
  await store.setJSON("worldbook/index.json", entries.map(item => item.id === id ? entry : item));
  return responseJson({ entry });
}

function parseDraftPayload(content: string) {
  const withoutFence = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  const candidates = [withoutFence];
  const arrayStart = withoutFence.indexOf("[");
  const arrayEnd = withoutFence.lastIndexOf("]");
  if (arrayStart >= 0 && arrayEnd > arrayStart) candidates.push(withoutFence.slice(arrayStart, arrayEnd + 1));
  const objectStart = withoutFence.indexOf("{");
  const objectEnd = withoutFence.lastIndexOf("}");
  if (objectStart >= 0 && objectEnd > objectStart) candidates.push(withoutFence.slice(objectStart, objectEnd + 1));
  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as unknown;
      if (Array.isArray(parsed)) return parsed;
      if (parsed && typeof parsed === "object") {
        const object = parsed as Record<string, unknown>;
        if (Array.isArray(object.items)) return object.items;
        if (Array.isArray(object.drafts)) return object.drafts;
      }
    } catch { /* Try the next JSON-shaped section. */ }
  }
  throw new Error("模型返回的格式无法拆成角色草稿，请重试");
}

function loreFor(character: StoredCharacter, entries: WorldEntry[]) {
  return entries
    .filter(entry => entry.enabled && (entry.scope === "全局" || entry.scope === character.name))
    .slice(0, 30)
    .map(entry => `${entry.title}：${entry.content}`)
    .join("\n");
}

async function generateAi(request: Request) {
  const user = await currentUser(request);
  if (!user) return error("请先登录", 401);
  if (user.role !== "admin") return error("只有管理员可以调用 AI", 403);
  const config = await readAiConfig();
  if (!config?.apiKey) return error("请先在接口页面保存并测试 API 配置", 409);
  const body = await bodyJson(request);
  const mode = body.mode === "reply" ? "reply" : "moment";
  const requestedIds = Array.isArray(body.characterIds) ? body.characterIds.filter(id => typeof id === "string").slice(0, 12) as string[] : [];
  if (!requestedIds.length) return error("请至少选择一位 AI 成员");
  const [allCharacters, worldEntries] = await Promise.all([readCharacters(), readWorldEntries()]);
  let selected = allCharacters.filter(character => requestedIds.includes(character.id) && character.enabled);
  if (!selected.length) return error("选择的 AI 成员当前不可用");

  let target: StoredPost | null = null;
  if (mode === "reply") {
    const postId = typeof body.postId === "string" ? body.postId : "";
    target = await store.get(`posts/${postId}.json`, { type: "json", consistency: "strong" }) as StoredPost | null;
    if (!target) return error("要回应的动态已经不存在了", 404);
    selected = selected.filter(character => character.name !== target?.author);
    if (!selected.length) return error("原动态作者不能回应自己");
  }

  const roleContext = selected.map(character => ({
    characterId: character.id,
    name: character.name,
    persona: character.note,
    greeting: character.greeting,
    lore: loreFor(character, worldEntries),
  }));
  const requirement = cleanText(body.prompt, 2_000) || (mode === "reply"
    ? "以角色自己的口吻，自然回应这条朋友圈；接住情绪，不要复述原文，也不要解释自己是 AI。"
    : "以角色自己的口吻，写一条自然的朋友圈；不要解释自己是 AI。");
  const task = mode === "reply" ? {
    type: "回应朋友圈",
    originalPost: { author: target?.author, text: target?.text, hasImage: Boolean(target?.imageVersion) },
    existingComments: target?.comments.map(comment => ({ author: comment.name, text: comment.text })) || [],
    requirement,
    characters: roleContext,
  } : {
    type: "生成朋友圈",
    currentTime: new Date().toISOString(),
    requirement,
    characters: roleContext,
  };
  const content = await callModel(config, [
    { role: "system", content: `你在私密社交空间“一梦间”中扮演多个虚构角色。严格遵循每位角色的人设和世界书，角色不知道自己是 AI。只输出 JSON，不要 Markdown。格式必须是 {"items":[{"characterId":"角色ID","text":"内容"}]}，每个指定角色恰好一项。${mode === "reply" ? "每条回应不超过300字。" : "每条朋友圈不超过600字。"}` },
    { role: "user", content: JSON.stringify(task) },
  ]);
  const rawItems = parseDraftPayload(content);
  const maximum = mode === "reply" ? 300 : 600;
  const drafts: GeneratedDraft[] = selected.flatMap(character => {
    const item = rawItems.find(raw => raw && typeof raw === "object" && ((raw as Record<string, unknown>).characterId === character.id || (raw as Record<string, unknown>).name === character.name));
    if (!item || typeof item !== "object") return [];
    const text = cleanText((item as Record<string, unknown>).text, maximum);
    return text ? [{ characterId: character.id, author: character.name, initial: character.initial, color: character.color, text }] : [];
  });
  if (!drafts.length) return error("模型没有返回可用的角色草稿", 502);
  return responseJson({ drafts });
}

export async function onRequest({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    if (request.method === "GET" && path === "/api/status") return await status();
    if (request.method === "GET" && path === "/api/session") return await session(request);
    if (request.method === "GET" && path === "/api/feed") return await feed(request);
    if (request.method === "GET" && path === "/api/characters") return await characters(request);
    if (request.method === "GET" && path === "/api/members") return await members(request);
    if (request.method === "GET" && path === "/api/ai-config") return await aiConfig(request);
    if (request.method === "GET" && path === "/api/worldbook") return await worldbook(request);
    if (request.method === "GET" && path.startsWith("/api/avatar/")) return await serveAvatar(request, path);
    if (request.method === "GET" && path.startsWith("/api/post-image/")) return await servePostImage(request, path);

    if (request.method !== "GET" && !ensureSameOrigin(request)) return error("请求来源无效", 403);
    if (request.method === "POST" && path === "/api/setup") return await setup(request);
    if (request.method === "POST" && path === "/api/login") return await login(request);
    if (request.method === "POST" && path === "/api/logout") return await logout(request);
    if (request.method === "POST" && path === "/api/profile") return await updateProfile(request);
    if (request.method === "POST" && path === "/api/characters") return await createCharacter(request);
    if (request.method === "POST" && path === "/api/character-action") return await characterAction(request);
    if (request.method === "POST" && path === "/api/avatar") return await uploadAvatar(request);
    if (request.method === "POST" && path === "/api/posts") return await createPost(request);
    if (request.method === "POST" && path === "/api/post-action") return await postAction(request);
    if (request.method === "POST" && path === "/api/ai-config") return await aiConfig(request);
    if (request.method === "POST" && path === "/api/ai-generate") return await generateAi(request);
    if (request.method === "POST" && path === "/api/worldbook") return await worldbook(request);
    return error("接口不存在", 404);
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "服务器暂时无法处理请求";
    return error(message, 500);
  }
}
