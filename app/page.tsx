"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

type IconName =
  | "home" | "spark" | "users" | "book" | "plug" | "settings"
  | "heart" | "comment" | "image" | "send" | "plus" | "upload"
  | "wand" | "check" | "close" | "eye" | "lock" | "logout"
  | "chevron" | "edit" | "trash" | "more" | "moon" | "grid" | "shield" | "search";

function Icon({ name, size = 19 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V21h13V9.5M9 21v-7h6v7"/></>,
    spark: <><path d="m12 2 1.5 5.1L19 9l-5.5 1.9L12 16l-1.5-5.1L5 9l5.5-1.9L12 2Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M8 7h8M8 11h6"/></>,
    plug: <><path d="m12 22 4-4-3-3 4-4-4-4-4 4-3-3-4 4"/><path d="m19 5-2 2M22 8l-2 2M2 22l5-5"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.09A1.7 1.7 0 0 0 8.5 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.09A1.7 1.7 0 0 0 4.6 8.5a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 15.5 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.16.37.36.7.6 1 .28.34.68.54 1.1.6h.09v4h-.09A1.7 1.7 0 0 0 19.4 15Z"/></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/>,
    comment: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/></>,
    wand: <><path d="m15 4 5 5L8 21l-5-5Z"/><path d="m6 14 4 4M18 2v3M22 6h-3M4 2v2M2 4h2"/></>,
    check: <path d="m20 6-11 11-5-5"/>,
    close: <><path d="m18 6-12 12M6 6l12 12"/></>,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M21 19V5a2 2 0 0 0-2-2h-6"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"/></>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/>,
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

type Character = { id: string; name: string; note: string; greeting?: string; color: string; initial: string; enabled: boolean; book: string; avatarUrl?: string };
type Moment = { id: string; authorId?: string; author: string; initial: string; role: string; time: string; createdAt?: string; text: string; color: string; image?: string; likedBy: string[]; comments: { name: string; text: string; createdAt?: string }[] };
type Draft = { id: string; characterId: string; author: string; initial: string; color: string; text: string };
type ReplyDraft = Draft & { momentId: string };
type AvatarShape = "organic" | "round" | "square";
type LoginUser = { id: "qing" | "friend"; displayName: string; role: "admin" | "member"; initial: string; color: string; signature: string; avatarUrl?: string };

const avatarShapeOptions: { value: AvatarShape; label: string }[] = [
  { value: "organic", label: "原本" },
  { value: "round", label: "圆形" },
  { value: "square", label: "方形" },
];

const isAvatarShape = (value: unknown): value is AvatarShape => value === "organic" || value === "round" || value === "square";

const initialCharacters: Character[] = [
  { id: "nanzhi", name: "南枝", note: "温柔、敏锐，喜欢记录雨天与旧物。", color: "#d7728d", initial: "枝", enabled: true, book: "雾港旧闻" },
  { id: "yuke", name: "雨客", note: "寡言的夜行者，说话短而有画面感。", color: "#5f6f88", initial: "雨", enabled: true, book: "共用世界书" },
  { id: "shisui", name: "时穗", note: "热衷甜点和植物，总能发现小小的好事。", color: "#b784a7", initial: "穗", enabled: true, book: "无绑定" },
];

const navItems = [
  { key: "feed", label: "梦间", icon: "home" as IconName },
  { key: "generate", label: "生成", icon: "spark" as IconName },
  { key: "replies", label: "回应", icon: "comment" as IconName },
  { key: "characters", label: "成员", icon: "users" as IconName },
  { key: "worldbook", label: "世界书", icon: "book" as IconName },
  { key: "api", label: "接口", icon: "plug" as IconName },
];

function momentTime(createdAt?: string) {
  if (!createdAt) return "刚刚";
  const time = new Date(createdAt);
  const elapsed = Date.now() - time.getTime();
  if (elapsed < 60_000) return "刚刚";
  if (elapsed < 60 * 60_000) return `${Math.floor(elapsed / 60_000)} 分钟前`;
  const now = new Date();
  const sameDay = now.toDateString() === time.toDateString();
  if (sameDay) return `今天 ${time.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false })}`;
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
  if (yesterday.toDateString() === time.toDateString()) return `昨天 ${time.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false })}`;
  return time.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const formBody = typeof FormData !== "undefined" && init?.body instanceof FormData;
  const response = await fetch(path, {
    ...init,
    credentials: "same-origin",
    headers: init?.body && !formBody ? { "Content-Type": "application/json", ...(init.headers || {}) } : init?.headers,
  });
  const data = await response.json().catch(() => ({})) as T & { error?: string };
  if (!response.ok) throw new Error(data.error || "暂时无法连接一梦间");
  return data;
}

type ImportedWorldEntry = { title: string; keys: string; content: string; enabled: boolean };
type ImportedCharacterCard = { name: string; note: string; greeting: string; worldEntries: ImportedWorldEntry[] };

function recordValue(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function textValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseCharacterCard(raw: unknown, fallbackName: string): ImportedCharacterCard {
  const root = recordValue(raw);
  const data = Object.keys(recordValue(root.data)).length ? recordValue(root.data) : root;
  const name = textValue(data.name) || fallbackName;
  const sections = [
    ["角色描述", data.description],
    ["性格", data.personality],
    ["场景", data.scenario],
    ["系统设定", data.system_prompt],
    ["示例对话", data.mes_example],
    ["创作者备注", data.creator_notes],
  ].flatMap(([label, value]) => textValue(value) ? [`${label}：\n${textValue(value)}`] : []);
  const book = recordValue(data.character_book);
  const rawEntries = Array.isArray(book.entries) ? book.entries : Object.values(recordValue(book.entries));
  const worldEntries = rawEntries.flatMap((value, index) => {
    const entry = recordValue(value);
    const content = textValue(entry.content);
    if (!content) return [];
    const keys = Array.isArray(entry.keys) ? entry.keys.filter(key => typeof key === "string").join(", ") : textValue(entry.keys);
    return [{ title: textValue(entry.comment) || textValue(entry.name) || `卡内条目 ${index + 1}`, keys, content, enabled: entry.enabled !== false && entry.disable !== true }];
  });
  return { name: name.slice(0, 20), note: sections.join("\n\n").slice(0, 8000) || "由角色卡导入，暂无详细设定。", greeting: textValue(data.first_mes).slice(0, 1000), worldEntries: worldEntries.slice(0, 50) };
}

async function readPngCharacterCard(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 8;
  while (offset + 12 <= bytes.length) {
    const length = view.getUint32(offset);
    const type = new TextDecoder("latin1").decode(bytes.slice(offset + 4, offset + 8));
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    if (dataEnd + 4 > bytes.length) break;
    if (type === "tEXt") {
      const chunk = bytes.slice(dataStart, dataEnd);
      const separator = chunk.indexOf(0);
      const keyword = new TextDecoder("latin1").decode(chunk.slice(0, separator));
      if (keyword === "chara") {
        const encoded = new TextDecoder("latin1").decode(chunk.slice(separator + 1));
        const binary = window.atob(encoded);
        const decoded = Uint8Array.from(binary, character => character.charCodeAt(0));
        return JSON.parse(new TextDecoder().decode(decoded)) as unknown;
      }
    }
    offset = dataEnd + 4;
  }
  throw new Error("这张 PNG 中没有找到酒馆角色卡数据");
}

async function readCharacterCard(file: File) {
  const fallbackName = file.name.replace(/\.(json|png)$/i, "") || "导入角色";
  const raw = file.name.toLowerCase().endsWith(".png") ? await readPngCharacterCard(file) : JSON.parse(await file.text()) as unknown;
  return parseCharacterCard(raw, fallbackName);
}

function Avatar({ initial, color, size = "md", online = false, src }: { initial: string; color: string; size?: "sm" | "md" | "lg" | "xl"; online?: boolean; src?: string }) {
  return <span className={`avatar avatar-${size} ${src ? "has-photo" : ""}`} style={{ "--avatar-color": color } as React.CSSProperties}><span className={src ? "avatar-photo" : ""} style={src ? { backgroundImage: `url(${JSON.stringify(src)})` } : undefined}>{src ? "" : initial}</span>{online && <i />}</span>;
}

function MomentMedia({ image, author, onDoubleClick }: { image: string; author: string; onDoubleClick?: () => void }) {
  const demoArt = image === "rain" || image === "night" || image === "paper";
  if (demoArt) return <div className={`moment-art art-${image}`} role="img" tabIndex={0} onDoubleClick={onDoubleClick} aria-label={`${author}的动态图片，双击喜欢`}><span/><i/><b/><em/></div>;
  return <div className="moment-art moment-photo" role="img" tabIndex={0} onDoubleClick={onDoubleClick} aria-label={`${author}发布的图片，双击喜欢`} style={{ backgroundImage: `url(${JSON.stringify(image)})` }}/>
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return <button type="button" className={`switch ${checked ? "is-on" : ""}`} onClick={onChange} aria-pressed={checked} aria-label={label}><span /></button>;
}

function Segmented({ value, onChange, options, small = false }: { value: string; onChange: (value: string) => void; options: { value: string; label: string; icon?: IconName }[]; small?: boolean }) {
  return <div className={`segmented ${small ? "segmented-small" : ""}`}>{options.map(option => <button type="button" key={option.value} className={value === option.value ? "active" : ""} onClick={() => onChange(option.value)}>{option.icon && <Icon name={option.icon} size={15}/>}<span>{option.label}</span></button>)}</div>;
}

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [bootState, setBootState] = useState<"loading" | "setup" | "login" | "ready">("loading");
  const [availableUsers, setAvailableUsers] = useState<LoginUser[]>([]);
  const [sessionUser, setSessionUser] = useState<LoginUser | null>(null);
  const [loginProfile, setLoginProfile] = useState<"qing" | "friend">("qing");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [setupForm, setSetupForm] = useState({ adminName: "青", adminPassword: "", friendName: "好友", friendPassword: "" });
  const [mode, setMode] = useState<"life" | "admin">("life");
  const [active, setActive] = useState("feed");
  const [style, setStyle] = useState<"glass" | "pixel">("glass");
  const [palette, setPalette] = useState<"ink" | "pink">("pink");
  const [themeOpen, setThemeOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerText, setComposerText] = useState("");
  const [composerImage, setComposerImage] = useState<Blob | null>(null);
  const [composerImagePreview, setComposerImagePreview] = useState("");
  const [editingMomentId, setEditingMomentId] = useState<string | null>(null);
  const [postMenuId, setPostMenuId] = useState<string | null>(null);
  const [moments, setMoments] = useState<Moment[]>([]);
  const [characters, setCharacters] = useState(initialCharacters);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>(["nanzhi", "yuke", "shisui"]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [batchState, setBatchState] = useState<"idle" | "running" | "done">("idle");
  const [generationPrompt, setGenerationPrompt] = useState("根据角色此刻的状态，自然地写一条朋友圈。可以分享日常、心情或一个小发现；保持角色口吻，不要解释自己是 AI。");
  const [replyMomentId, setReplyMomentId] = useState("");
  const [replyCharacterIds, setReplyCharacterIds] = useState<string[]>(["nanzhi", "yuke", "shisui"]);
  const [replyDrafts, setReplyDrafts] = useState<ReplyDraft[]>([]);
  const [replyBatchState, setReplyBatchState] = useState<"idle" | "running" | "done">("idle");
  const [replyPrompt, setReplyPrompt] = useState("读完这条朋友圈后，以角色自己的口吻自然回应。可以接住对方的情绪或分享联想到的小事；不要重复原文，不要解释自己是 AI。");
  const [toast, setToast] = useState("");
  const [commentBox, setCommentBox] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [worldEntries, setWorldEntries] = useState<WorldEntry[]>([]);
  const [worldModal, setWorldModal] = useState(false);
  const [editingWorldId, setEditingWorldId] = useState<string | null>(null);
  const [worldBusy, setWorldBusy] = useState(false);
  const [worldForm, setWorldForm] = useState({ title: "", scope: "全局", trigger: "关键词", keys: "", position: "角色设定之后", content: "" });
  const [characterModal, setCharacterModal] = useState(false);
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(null);
  const [characterBusy, setCharacterBusy] = useState(false);
  const [newCharacter, setNewCharacter] = useState({ name: "", description: "", greeting: "" });
  const [apiKey, setApiKey] = useState("");
  const [apiBase, setApiBase] = useState("");
  const [model, setModel] = useState("");
  const [apiHasKey, setApiHasKey] = useState(false);
  const [apiTemperature, setApiTemperature] = useState(0.85);
  const [apiMaxTokens, setApiMaxTokens] = useState(1800);
  const [apiTest, setApiTest] = useState<"idle" | "testing" | "ok">("idle");
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileTab, setProfileTab] = useState<"grid" | "timeline">("grid");
  const [signatureModal, setSignatureModal] = useState(false);
  const [signatureDraft, setSignatureDraft] = useState("");
  const [signatureBusy, setSignatureBusy] = useState(false);
  const [avatarSources, setAvatarSources] = useState<Record<string, string>>({});
  const [avatarTarget, setAvatarTarget] = useState<string | null>(null);
  const [avatarShapes, setAvatarShapes] = useState<Record<"qing" | "friend", AvatarShape>>({ qing: "organic", friend: "organic" });
  const importRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const momentImageInputRef = useRef<HTMLInputElement>(null);

  const selectedLoginUser = availableUsers.find(user => user.id === loginProfile);
  const activeAccount = sessionUser ?? selectedLoginUser ?? { id: loginProfile, displayName: loginProfile === "qing" ? "青" : "好友", role: loginProfile === "qing" ? "admin" as const : "member" as const, initial: loginProfile === "qing" ? "青" : "友", color: loginProfile === "qing" ? "#c46483" : "#7186a2", signature: "" };
  const isAdmin = sessionUser?.role === "admin";
  const currentUser = { name: activeAccount.displayName, initial: activeAccount.initial, color: activeAccount.color };
  const otherUser = availableUsers.find(user => user.id !== sessionUser?.id) ?? availableUsers.find(user => user.id === "friend");
  const avatarShape = avatarShapes[sessionUser?.id ?? loginProfile];
  const displayAvatarSources = useMemo(() => {
    const next = { ...avatarSources };
    for (const user of availableUsers) if (user.avatarUrl) next[user.displayName] = user.avatarUrl;
    for (const character of characters) if (character.avatarUrl) next[character.name] = character.avatarUrl;
    return next;
  }, [avatarSources, availableUsers, characters]);

  useEffect(() => {
    const savedStyle = window.localStorage.getItem("yimeng-style") as "glass" | "pixel" | null;
    const savedPalette = window.localStorage.getItem("yimeng-palette") as "ink" | "pink" | null;
    const savedAvatars = window.localStorage.getItem("yimeng-local-avatars");
    const savedAvatarShapes = window.localStorage.getItem("yimeng-avatar-shapes");
    const frame = window.requestAnimationFrame(() => {
      if (savedStyle) setStyle(savedStyle);
      if (savedPalette) setPalette(savedPalette);
      if (savedAvatars) {
        try { setAvatarSources(JSON.parse(savedAvatars) as Record<string, string>); } catch { /* Ignore a damaged local preview. */ }
      }
      if (savedAvatarShapes) {
        try {
          const parsed = JSON.parse(savedAvatarShapes) as Partial<Record<"qing" | "friend", unknown>>;
          setAvatarShapes(current => ({
            qing: isAvatarShape(parsed.qing) ? parsed.qing : current.qing,
            friend: isAvatarShape(parsed.friend) ? parsed.friend : current.friend,
          }));
        } catch { /* Ignore a damaged local preference. */ }
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const refreshMoments = useCallback(async (quiet = false) => {
    try {
      const data = await apiRequest<{ posts: Moment[] }>("/api/feed");
      const next = data.posts.map(post => ({ ...post, time: momentTime(post.createdAt) }));
      setMoments(next);
      setReplyMomentId(current => current && next.some(post => post.id === current) ? current : next[0]?.id ?? "");
    } catch (caught) {
      if (!quiet) setToast(caught instanceof Error ? caught.message : "动态同步失败");
    }
  }, []);

  const refreshCharacters = useCallback(async (quiet = false) => {
    try {
      const data = await apiRequest<{ characters: Character[] }>("/api/characters");
      setCharacters(data.characters);
      const availableIds = new Set(data.characters.map(character => character.id));
      setSelectedCharacters(current => current.filter(id => availableIds.has(id)));
      setReplyCharacterIds(current => current.filter(id => availableIds.has(id)));
    } catch (caught) {
      if (!quiet) setToast(caught instanceof Error ? caught.message : "角色同步失败");
    }
  }, []);

  const refreshMembers = useCallback(async (quiet = false) => {
    try {
      const data = await apiRequest<{ users: LoginUser[] }>("/api/members");
      setAvailableUsers(data.users);
      setSessionUser(current => current ? data.users.find(user => user.id === current.id) ?? current : current);
    } catch (caught) {
      if (!quiet) setToast(caught instanceof Error ? caught.message : "成员资料同步失败");
    }
  }, []);

  const refreshAiConfig = useCallback(async (quiet = false) => {
    try {
      const data = await apiRequest<{ config: { baseUrl: string; model: string; temperature: number; maxTokens: number; hasApiKey: boolean } }>("/api/ai-config");
      setApiBase(data.config.baseUrl);
      setModel(data.config.model);
      setApiTemperature(data.config.temperature);
      setApiMaxTokens(data.config.maxTokens);
      setApiHasKey(data.config.hasApiKey);
      setApiTest(data.config.hasApiKey ? "ok" : "idle");
    } catch (caught) {
      if (!quiet) setToast(caught instanceof Error ? caught.message : "API 配置读取失败");
    }
  }, []);

  const refreshWorldbook = useCallback(async (quiet = false) => {
    try {
      const data = await apiRequest<{ entries: WorldEntry[] }>("/api/worldbook");
      setWorldEntries(data.entries);
    } catch (caught) {
      if (!quiet) setToast(caught instanceof Error ? caught.message : "世界书同步失败");
    }
  }, []);

  useEffect(() => {
    let active = true;
    const boot = async () => {
      try {
        const status = await apiRequest<{ initialized: boolean; users: LoginUser[] }>("/api/status");
        if (!active) return;
        setAvailableUsers(status.users);
        if (status.users.length) setLoginProfile(status.users[0].id);
        if (!status.initialized) {
          setBootState("setup");
          return;
        }
        try {
          const current = await apiRequest<{ user: LoginUser }>("/api/session");
          if (!active) return;
          setSessionUser(current.user);
          setLoggedIn(true);
          setBootState("ready");
          await Promise.all([refreshMoments(true), refreshCharacters(true), refreshMembers(true), current.user.role === "admin" ? Promise.all([refreshAiConfig(true), refreshWorldbook(true)]) : Promise.resolve()]);
        } catch {
          if (active) setBootState("login");
        }
      } catch (caught) {
        if (!active) return;
        setAuthError(caught instanceof Error ? caught.message : "暂时无法连接云端");
        setAvailableUsers([
          { id: "qing", displayName: "青", role: "admin", initial: "青", color: "#c46483", signature: "" },
          { id: "friend", displayName: "好友", role: "member", initial: "友", color: "#7186a2", signature: "" },
        ]);
        setBootState("login");
      }
    };
    void boot();
    return () => { active = false; };
  }, [refreshAiConfig, refreshCharacters, refreshMembers, refreshMoments, refreshWorldbook]);

  useEffect(() => {
    if (!loggedIn) return;
    const refresh = () => { void Promise.all([refreshMoments(true), refreshCharacters(true), refreshMembers(true), isAdmin ? refreshWorldbook(true) : Promise.resolve()]); };
    const timer = window.setInterval(refresh, 12_000);
    window.addEventListener("focus", refresh);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", refresh); };
  }, [isAdmin, loggedIn, refreshCharacters, refreshMembers, refreshMoments, refreshWorldbook]);

  useEffect(() => {
    window.localStorage.setItem("yimeng-style", style);
    window.localStorage.setItem("yimeng-palette", palette);
  }, [style, palette]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const enabledCharacters = useMemo(() => characters.filter(character => character.enabled), [characters]);
  const profileInfo = profileName ? (() => {
    const character = characters.find(item => item.name === profileName);
    if (character) return { name: character.name, initial: character.initial, color: character.color, role: "AI 成员", bio: character.note, detail: character.book };
    const member = availableUsers.find(user => user.displayName === profileName);
    if (member?.role === "admin") return { name: member.displayName, initial: member.initial, color: member.color, role: "真人成员", bio: member.signature || "还没有填写个性签名。", detail: "管理员" };
    return { name: member?.displayName ?? profileName, initial: member?.initial ?? profileName.slice(0, 1), color: member?.color ?? "#7186a2", role: "真人成员", bio: member?.signature || "还没有填写个性签名。", detail: "受邀成员" };
  })() : null;
  const profileMoments = profileName ? moments.filter(moment => moment.author === profileName) : [];
  const profileLikes = profileMoments.reduce((total, moment) => total + moment.likedBy.length, 0);
  const editingMoment = editingMomentId ? moments.find(moment => moment.id === editingMomentId) : null;
  const canChangeProfileAvatar = Boolean(profileInfo && (profileInfo.name === currentUser.name || (isAdmin && profileInfo.role === "AI 成员")));
  const isOwnProfile = Boolean(profileInfo && profileInfo.name === currentUser.name);

  const openProfile = (name: string) => { setProfileName(name); setProfileTab("grid"); };

  const chooseAvatar = (name: string) => {
    setAvatarTarget(name);
    avatarInputRef.current?.click();
  };

  const resizeAvatar = (file: File) => new Promise<Blob>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read"));
    reader.onload = () => {
      const source = typeof reader.result === "string" ? reader.result : "";
      const image = new window.Image();
      image.onerror = () => reject(new Error("image"));
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 360;
        canvas.width = size; canvas.height = size;
        const context = canvas.getContext("2d");
        if (!context) { reject(new Error("canvas")); return; }
        const side = Math.min(image.naturalWidth, image.naturalHeight);
        const offsetX = (image.naturalWidth - side) / 2;
        const offsetY = (image.naturalHeight - side) / 2;
        context.drawImage(image, offsetX, offsetY, side, side, 0, 0, size, size);
        canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("canvas")), "image/webp", .86);
      };
      image.src = source;
    };
    reader.readAsDataURL(file);
  });

  const updateAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !avatarTarget) return;
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) { setToast("请选择 10MB 以内的图片"); event.target.value = ""; return; }
    try {
      const resized = await resizeAvatar(file);
      const character = characters.find(item => item.name === avatarTarget);
      const account = availableUsers.find(item => item.displayName === avatarTarget);
      const form = new FormData();
      form.set("kind", character ? "character" : "user");
      form.set("id", character?.id || account?.id || sessionUser?.id || "");
      form.set("file", resized, "avatar.webp");
      const response = await fetch("/api/avatar", { method: "POST", body: form, credentials: "same-origin" });
      const data = await response.json().catch(() => ({})) as { user?: LoginUser; character?: Character; error?: string };
      if (!response.ok) throw new Error(data.error || "头像保存失败");
      if (data.user) {
        setSessionUser(data.user);
        setAvailableUsers(current => current.map(item => item.id === data.user?.id ? data.user : item));
      }
      if (data.character) setCharacters(current => current.map(item => item.id === data.character?.id ? data.character : item));
      setAvatarSources(current => { const next = { ...current }; delete next[avatarTarget]; return next; });
      setToast(`${avatarTarget}的头像已保存，两台设备都会看到`);
    } catch (caught) { setToast(caught instanceof Error ? caught.message : "这张图片没有读取成功，请换一张试试"); }
    setAvatarTarget(null);
    event.target.value = "";
  };

  const resizeMomentImage = (file: File) => new Promise<Blob>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("图片读取失败"));
    reader.onload = () => {
      const image = new window.Image();
      image.onerror = () => reject(new Error("图片读取失败"));
      image.onload = () => {
        const maximum = 1600;
        const scale = Math.min(1, maximum / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext("2d");
        if (!context) { reject(new Error("图片处理失败")); return; }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("图片处理失败")), "image/webp", .86);
      };
      image.src = typeof reader.result === "string" ? reader.result : "";
    };
    reader.readAsDataURL(file);
  });

  const chooseMomentImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 15 * 1024 * 1024) { setToast("请选择 15MB 以内的图片"); event.target.value = ""; return; }
    try {
      const image = await resizeMomentImage(file);
      if (composerImagePreview) URL.revokeObjectURL(composerImagePreview);
      setComposerImage(image);
      setComposerImagePreview(URL.createObjectURL(image));
    } catch (caught) { setToast(caught instanceof Error ? caught.message : "图片处理失败"); }
    event.target.value = "";
  };

  const clearComposerImage = () => {
    if (composerImagePreview) URL.revokeObjectURL(composerImagePreview);
    setComposerImage(null);
    setComposerImagePreview("");
  };

  const openNewComposer = () => {
    setEditingMomentId(null);
    setComposerText("");
    clearComposerImage();
    setComposerOpen(true);
  };

  const updateAvatarShape = (shape: AvatarShape) => {
    const next = { ...avatarShapes, [loginProfile]: shape };
    setAvatarShapes(next);
    try {
      window.localStorage.setItem("yimeng-avatar-shapes", JSON.stringify(next));
      setToast("头像显示方式已保存在这台设备");
    } catch { setToast("形状已切换，但当前浏览器无法保存"); }
  };

  const finishLogin = async (user: LoginUser, users = availableUsers) => {
    setSessionUser(user);
    setAvailableUsers(users);
    setLoginProfile(user.id);
    setLoggedIn(true);
    setBootState("ready");
    setMode("life");
    setActive("feed");
    setPassword("");
    setAuthError("");
    await Promise.all([refreshMoments(true), refreshCharacters(true), refreshMembers(true), user.role === "admin" ? Promise.all([refreshAiConfig(true), refreshWorldbook(true)]) : Promise.resolve()]);
    setToast(`欢迎回来，${user.displayName}`);
  };

  const initialize = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthBusy(true); setAuthError("");
    try {
      const data = await apiRequest<{ user: LoginUser; users: LoginUser[] }>("/api/setup", { method: "POST", body: JSON.stringify(setupForm) });
      await finishLogin(data.user, data.users);
    } catch (caught) {
      setAuthError(caught instanceof Error ? caught.message : "初始化失败");
    } finally {
      setAuthBusy(false);
    }
  };

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthBusy(true); setAuthError("");
    try {
      const data = await apiRequest<{ user: LoginUser }>("/api/login", { method: "POST", body: JSON.stringify({ userId: loginProfile, password }) });
      await finishLogin(data.user);
    } catch (caught) {
      setAuthError(caught instanceof Error ? caught.message : "登录失败");
    } finally {
      setAuthBusy(false);
    }
  };

  const logout = async () => {
    try { await apiRequest<{ ok: boolean }>("/api/logout", { method: "POST", body: "{}" }); } catch { /* The local session is cleared either way. */ }
    setSessionUser(null); setAvailableUsers(current => current.map(user => ({ ...user, avatarUrl: undefined }))); setLoggedIn(false); setBootState("login"); setMode("life"); setActive("feed"); setMoments([]); setProfileName(null);
  };

  const goTo = (key: string) => {
    if (key === "feed") { setMode("life"); setActive("feed"); return; }
    if (!isAdmin) { setToast("这个入口只对管理员开放"); return; }
    setMode("admin"); setActive(key);
  };

  const toggleMode = (next: string) => {
    if (next === "admin" && !isAdmin) return;
    setMode(next as "life" | "admin"); setActive(next === "life" ? "feed" : "generate");
  };

  const savePost = async (text: string, actor?: { id: string; name: string; initial: string; color: string }, image?: Blob | null) => {
    let body: BodyInit;
    if (image && !actor) {
      const form = new FormData();
      form.set("text", text);
      form.set("image", image, "moment.webp");
      body = form;
    } else {
      body = JSON.stringify({ text, actor });
    }
    const data = await apiRequest<{ post: Moment }>("/api/posts", { method: "POST", body });
    const post = { ...data.post, time: momentTime(data.post.createdAt) };
    setMoments(current => [post, ...current.filter(item => item.id !== post.id)]);
    setReplyMomentId(current => current || post.id);
    return post;
  };

  const publishMoment = async () => {
    if (!composerText.trim() && !composerImage && !editingMoment?.image) return;
    try {
      if (editingMomentId) {
        const data = await apiRequest<{ post: Moment }>("/api/post-action", { method: "POST", body: JSON.stringify({ postId: editingMomentId, action: "edit", text: composerText.trim() }) });
        setMoments(current => current.map(moment => moment.id === editingMomentId ? { ...data.post, time: momentTime(data.post.createdAt) } : moment));
        setToast("动态修改已保存");
      } else {
        await savePost(composerText.trim(), undefined, composerImage);
        setToast("已经同步到梦间了");
      }
      setComposerText(""); setComposerOpen(false); setEditingMomentId(null); clearComposerImage();
    } catch (caught) { setToast(caught instanceof Error ? caught.message : "发布失败"); }
  };

  const editMoment = (moment: Moment) => {
    setEditingMomentId(moment.id);
    setComposerText(moment.text);
    setPostMenuId(null);
    clearComposerImage();
    setComposerOpen(true);
  };

  const deleteMoment = async (moment: Moment) => {
    if (!window.confirm(`确定删除${moment.author === currentUser.name ? "这条" : `“${moment.author}”的这条`}动态吗？删除后无法恢复。`)) return;
    try {
      await apiRequest<{ deletedId: string }>("/api/post-action", { method: "POST", body: JSON.stringify({ postId: moment.id, action: "delete" }) });
      setMoments(current => current.filter(item => item.id !== moment.id));
      setReplyMomentId(current => current === moment.id ? "" : current);
      setPostMenuId(null);
      setToast("动态已删除");
    } catch (caught) { setToast(caught instanceof Error ? caught.message : "动态删除失败"); }
  };

  const copyMoment = async (moment: Moment) => {
    try {
      await navigator.clipboard.writeText(moment.text);
      setToast("动态文字已复制");
    } catch { setToast("当前浏览器无法复制，请长按正文复制"); }
    setPostMenuId(null);
  };

  const shareMoment = async (moment: Moment) => {
    try {
      const canShare = typeof navigator.share === "function";
      if (canShare) await navigator.share({ title: `${moment.author}在一梦间的动态`, text: moment.text });
      else await navigator.clipboard.writeText(moment.text);
      setToast(canShare ? "已打开分享" : "动态文字已复制");
    } catch { /* Closing the native share sheet needs no warning. */ }
  };

  const canManageMoment = (moment: Moment) => Boolean(isAdmin || moment.authorId === sessionUser?.id || (!moment.authorId && moment.author === currentUser.name));

  const startAiReply = (moment: Moment) => {
    selectReplyMoment(moment.id);
    setPostMenuId(null);
    goTo("replies");
  };

  const toggleLike = async (id: string) => {
    try {
      const data = await apiRequest<{ post: Moment }>("/api/post-action", { method: "POST", body: JSON.stringify({ postId: id, action: "like" }) });
      setMoments(current => current.map(moment => moment.id === id ? { ...data.post, time: momentTime(data.post.createdAt) } : moment));
    } catch (caught) { setToast(caught instanceof Error ? caught.message : "暂时无法喜欢这条动态"); }
  };

  const addComment = async (id: string) => {
    if (!commentText.trim()) return;
    try {
      const data = await apiRequest<{ post: Moment }>("/api/post-action", { method: "POST", body: JSON.stringify({ postId: id, action: "comment", text: commentText.trim() }) });
      setMoments(current => current.map(moment => moment.id === id ? { ...data.post, time: momentTime(data.post.createdAt) } : moment));
      setCommentText(""); setCommentBox(null);
    } catch (caught) { setToast(caught instanceof Error ? caught.message : "回应没有发送成功"); }
  };

  const toggleCharacterSelection = (id: string) => setSelectedCharacters(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);

  const selectReplyMoment = (id: string) => {
    const target = moments.find(moment => moment.id === id);
    setReplyMomentId(id);
    setReplyCharacterIds(current => current.filter(characterId => characters.find(character => character.id === characterId)?.name !== target?.author));
    setReplyDrafts([]);
    setReplyBatchState("idle");
  };

  const toggleReplyCharacter = (id: string) => setReplyCharacterIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);

  const runReplyBatch = async () => {
    const target = moments.find(moment => moment.id === replyMomentId);
    if (!target) { setToast("先选择一条要回应的朋友圈"); return; }
    const responders = characters.filter(character => character.enabled && character.name !== target.author && replyCharacterIds.includes(character.id));
    if (!responders.length) { setToast("先选择至少一位回应角色"); return; }
    setReplyBatchState("running");
    try {
      const data = await apiRequest<{ drafts: Draft[] }>("/api/ai-generate", { method: "POST", body: JSON.stringify({ mode: "reply", postId: target.id, characterIds: responders.map(character => character.id), prompt: replyPrompt }) });
      const next = data.drafts.map((draft, index) => ({ ...draft, id: `reply-${target.id}-${draft.characterId}-${Date.now()}-${index}`, momentId: target.id }));
      setReplyDrafts(next);
      setReplyBatchState("done");
      setToast(`已生成 ${next.length} 份回应草稿`);
    } catch (caught) {
      setReplyBatchState("idle");
      setToast(caught instanceof Error ? caught.message : "AI 回应生成失败");
    }
  };

  const publishReplyDraft = async (id: string) => {
    const draft = replyDrafts.find(item => item.id === id);
    if (!draft?.text.trim()) return;
    try {
      const data = await apiRequest<{ post: Moment }>("/api/post-action", { method: "POST", body: JSON.stringify({ postId: draft.momentId, action: "comment", text: draft.text.trim(), actor: { id: draft.characterId, name: draft.author, initial: draft.initial, color: draft.color } }) });
      setMoments(current => current.map(moment => moment.id === draft.momentId ? { ...data.post, time: momentTime(data.post.createdAt) } : moment));
      setReplyDrafts(current => current.filter(item => item.id !== id));
      setToast(`${draft.author}的回应已同步`);
    } catch (caught) { setToast(caught instanceof Error ? caught.message : "角色回应发布失败"); }
  };

  const publishAllReplyDrafts = async () => {
    const ready = replyDrafts.filter(draft => draft.text.trim());
    if (!ready.length) return;
    try {
      for (const draft of ready) {
        const data = await apiRequest<{ post: Moment }>("/api/post-action", { method: "POST", body: JSON.stringify({ postId: draft.momentId, action: "comment", text: draft.text.trim(), actor: { id: draft.characterId, name: draft.author, initial: draft.initial, color: draft.color } }) });
        setMoments(current => current.map(moment => moment.id === draft.momentId ? { ...data.post, time: momentTime(data.post.createdAt) } : moment));
      }
      setReplyDrafts([]);
      setToast(`${ready.length} 条角色回应已同步`);
    } catch (caught) { setToast(caught instanceof Error ? caught.message : "部分回应没有发布成功"); }
  };

  const runBatch = async () => {
    if (!selectedCharacters.length) { setToast("先选至少一位 AI 成员"); return; }
    setBatchState("running");
    try {
      const data = await apiRequest<{ drafts: Draft[] }>("/api/ai-generate", { method: "POST", body: JSON.stringify({ mode: "moment", characterIds: selectedCharacters, prompt: generationPrompt }) });
      const next = data.drafts.map((draft, index) => ({ ...draft, id: `draft-${draft.characterId}-${Date.now()}-${index}` }));
      setDrafts(next); setBatchState("done"); setToast(`一次请求已拆成 ${next.length} 份独立草稿`);
    } catch (caught) {
      setBatchState("idle");
      setToast(caught instanceof Error ? caught.message : "AI 动态生成失败");
    }
  };

  const publishDraft = async (id: string) => {
    const draft = drafts.find(item => item.id === id); if (!draft) return;
    try {
      await savePost(draft.text, { id: draft.characterId, name: draft.author, initial: draft.initial, color: draft.color });
      setDrafts(current => current.filter(item => item.id !== id)); setToast(`${draft.author}的朋友圈已同步`);
    } catch (caught) { setToast(caught instanceof Error ? caught.message : "角色动态发布失败"); }
  };

  const publishAllDrafts = async () => {
    if (!drafts.length) return;
    try {
      for (const draft of drafts) await savePost(draft.text, { id: draft.characterId, name: draft.author, initial: draft.initial, color: draft.color });
      const count = drafts.length;
      setDrafts([]); setToast(`${count} 条朋友圈已同步`);
    } catch (caught) { setToast(caught instanceof Error ? caught.message : "部分角色动态没有发布成功"); }
  };

  const openCreateCharacter = () => {
    setEditingCharacterId(null);
    setNewCharacter({ name: "", description: "", greeting: "" });
    setCharacterModal(true);
  };

  const openEditCharacter = (character: Character) => {
    setEditingCharacterId(character.id);
    setNewCharacter({ name: character.name, description: character.note, greeting: character.greeting || "" });
    setCharacterModal(true);
  };

  const saveCharacter = async () => {
    if (!newCharacter.name.trim() || characterBusy) return;
    setCharacterBusy(true);
    try {
      if (editingCharacterId) {
        const existing = characters.find(character => character.id === editingCharacterId);
        if (!existing) throw new Error("这个角色已经不存在了");
        const data = await apiRequest<{ character: Character }>("/api/character-action", { method: "POST", body: JSON.stringify({
          characterId: editingCharacterId,
          action: "update",
          name: newCharacter.name,
          note: newCharacter.description,
          greeting: newCharacter.greeting,
          color: existing.color,
          enabled: existing.enabled,
          book: existing.book,
        }) });
        setCharacters(current => current.map(character => character.id === editingCharacterId ? data.character : character));
        if (data.character.name !== existing.name) {
          setProfileName(current => current === existing.name ? data.character.name : current);
          setAvatarSources(current => {
            if (!current[existing.name]) return current;
            const next = { ...current, [data.character.name]: current[existing.name] };
            delete next[existing.name];
            try { window.localStorage.setItem("yimeng-local-avatars", JSON.stringify(next)); } catch { /* Keep the visible update even if local storage is full. */ }
            return next;
          });
        }
        setToast(`${data.character.name}的资料已保存`);
      } else {
        const colors = ["#a879a1", "#7186a2", "#c77a68", "#6e8f82"];
        const data = await apiRequest<{ character: Character }>("/api/characters", { method: "POST", body: JSON.stringify({
          name: newCharacter.name,
          note: newCharacter.description,
          greeting: newCharacter.greeting,
          color: colors[characters.length % colors.length],
          book: "无绑定",
        }) });
        setCharacters(current => [...current, data.character]);
        setSelectedCharacters(current => [...current, data.character.id]);
        setReplyCharacterIds(current => [...current, data.character.id]);
        setToast("AI 成员已经创建并保存");
      }
      setNewCharacter({ name: "", description: "", greeting: "" });
      setEditingCharacterId(null);
      setCharacterModal(false);
    } catch (caught) {
      setToast(caught instanceof Error ? caught.message : "角色资料保存失败");
    } finally {
      setCharacterBusy(false);
    }
  };

  const toggleCharacterEnabled = async (character: Character) => {
    try {
      const data = await apiRequest<{ character: Character }>("/api/character-action", { method: "POST", body: JSON.stringify({
        characterId: character.id,
        action: "update",
        name: character.name,
        note: character.note,
        greeting: character.greeting || "",
        color: character.color,
        enabled: !character.enabled,
        book: character.book,
      }) });
      setCharacters(current => current.map(item => item.id === character.id ? data.character : item));
      setToast(`${character.name}已${data.character.enabled ? "启用" : "暂停"}并保存`);
    } catch (caught) {
      setToast(caught instanceof Error ? caught.message : "角色状态保存失败");
    }
  };

  const deleteCharacter = async (character: Character) => {
    if (!window.confirm(`确定删除“${character.name}”吗？角色资料会从一梦间移除，已经发布的动态会保留。`)) return;
    try {
      await apiRequest<{ ok: boolean }>("/api/character-action", { method: "POST", body: JSON.stringify({ characterId: character.id, action: "delete" }) });
      setCharacters(current => current.filter(item => item.id !== character.id));
      setSelectedCharacters(current => current.filter(id => id !== character.id));
      setReplyCharacterIds(current => current.filter(id => id !== character.id));
      setDrafts(current => current.filter(draft => draft.characterId !== character.id));
      setReplyDrafts(current => current.filter(draft => draft.characterId !== character.id));
      setWorldEntries(current => current.filter(entry => entry.scope !== character.name));
      setAvatarSources(current => {
        const next = { ...current };
        delete next[character.name];
        try { window.localStorage.setItem("yimeng-local-avatars", JSON.stringify(next)); } catch { /* The cloud deletion still succeeds. */ }
        return next;
      });
      if (profileName === character.name) setProfileName(null);
      setToast(`${character.name}已删除`);
    } catch (caught) {
      setToast(caught instanceof Error ? caught.message : "删除角色失败");
    }
  };

  const importCharacter = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    try {
      const card = await readCharacterCard(file);
      const data = await apiRequest<{ character: Character }>("/api/characters", { method: "POST", body: JSON.stringify({ name: card.name, note: card.note, greeting: card.greeting, color: "#8d7697", book: card.worldEntries.length ? "卡内世界书" : "无绑定" }) });
      let importedCharacter = data.character;
      if (file.name.toLowerCase().endsWith(".png")) {
        const resized = await resizeAvatar(file);
        const form = new FormData();
        form.set("kind", "character"); form.set("id", data.character.id); form.set("file", resized, "avatar.webp");
        const avatarData = await apiRequest<{ character: Character }>("/api/avatar", { method: "POST", body: form });
        importedCharacter = avatarData.character;
      }
      const importedWorld: WorldEntry[] = [];
      for (const entry of card.worldEntries) {
        const saved = await apiRequest<{ entry: WorldEntry }>("/api/worldbook", { method: "POST", body: JSON.stringify({ action: "create", title: entry.title, scope: card.name, trigger: entry.keys ? "关键词" : "常驻", keys: entry.keys, position: "角色设定之后", enabled: entry.enabled, content: entry.content }) });
        importedWorld.push(saved.entry);
      }
      setCharacters(current => [...current, importedCharacter]);
      setWorldEntries(current => [...current, ...importedWorld]);
      setSelectedCharacters(current => [...current, importedCharacter.id]);
      setReplyCharacterIds(current => [...current, importedCharacter.id]);
      setToast(`${card.name}已导入并云端保存${importedWorld.length ? `，含 ${importedWorld.length} 条世界书` : ""}`);
    } catch (caught) {
      setToast(caught instanceof Error ? caught.message : "角色卡导入失败");
      void Promise.all([refreshCharacters(true), refreshWorldbook(true)]);
    }
    event.target.value = "";
  };

  const openSignatureEditor = () => {
    setSignatureDraft(sessionUser?.signature || "");
    setSignatureModal(true);
  };

  const saveSignature = async () => {
    if (!sessionUser || signatureBusy) return;
    setSignatureBusy(true);
    try {
      const data = await apiRequest<{ user: LoginUser }>("/api/profile", { method: "POST", body: JSON.stringify({ signature: signatureDraft }) });
      setSessionUser(data.user);
      setAvailableUsers(current => current.map(user => user.id === data.user.id ? data.user : user));
      setSignatureModal(false);
      setToast("个性签名已保存");
    } catch (caught) {
      setToast(caught instanceof Error ? caught.message : "签名保存失败");
    } finally {
      setSignatureBusy(false);
    }
  };

  const openCreateWorld = () => {
    setEditingWorldId(null);
    setWorldForm({ title: "", scope: "全局", trigger: "关键词", keys: "", position: "角色设定之后", content: "" });
    setWorldModal(true);
  };

  const openEditWorld = (entry: WorldEntry) => {
    setEditingWorldId(entry.id);
    setWorldForm({ title: entry.title, scope: entry.scope, trigger: entry.trigger, keys: entry.keys, position: entry.position, content: entry.content });
    setWorldModal(true);
  };

  const saveWorldEntry = async () => {
    if (!worldForm.title.trim() || !worldForm.content.trim() || worldBusy) return;
    setWorldBusy(true);
    try {
      const data = await apiRequest<{ entry: WorldEntry }>("/api/worldbook", { method: "POST", body: JSON.stringify({ action: editingWorldId ? "update" : "create", id: editingWorldId, ...worldForm, enabled: editingWorldId ? worldEntries.find(entry => entry.id === editingWorldId)?.enabled ?? true : true }) });
      setWorldEntries(current => editingWorldId ? current.map(entry => entry.id === editingWorldId ? data.entry : entry) : [...current, data.entry]);
      setWorldModal(false);
      setEditingWorldId(null);
      setToast(editingWorldId ? "世界书条目已更新并同步" : "世界书条目已保存并同步");
    } catch (caught) {
      setToast(caught instanceof Error ? caught.message : "世界书保存失败");
    } finally { setWorldBusy(false); }
  };

  const toggleWorldEntry = async (entry: WorldEntry) => {
    try {
      const data = await apiRequest<{ entry: WorldEntry }>("/api/worldbook", { method: "POST", body: JSON.stringify({ action: "update", ...entry, enabled: !entry.enabled }) });
      setWorldEntries(current => current.map(item => item.id === entry.id ? data.entry : item));
    } catch (caught) { setToast(caught instanceof Error ? caught.message : "世界书状态保存失败"); }
  };

  const deleteWorldEntry = async (entry: WorldEntry) => {
    if (!window.confirm(`确定删除世界书条目“${entry.title}”吗？`)) return;
    try {
      await apiRequest<{ deletedId: string }>("/api/worldbook", { method: "POST", body: JSON.stringify({ action: "delete", id: entry.id }) });
      setWorldEntries(current => current.filter(item => item.id !== entry.id));
      setToast("世界书条目已删除");
    } catch (caught) { setToast(caught instanceof Error ? caught.message : "世界书删除失败"); }
  };

  const testApi = async () => {
    setApiTest("testing");
    try {
      const data = await apiRequest<{ config: { baseUrl: string; model: string; temperature: number; maxTokens: number; hasApiKey: boolean }; answer: string }>("/api/ai-config", { method: "POST", body: JSON.stringify({ baseUrl: apiBase, apiKey, model, temperature: apiTemperature, maxTokens: apiMaxTokens }) });
      setApiBase(data.config.baseUrl);
      setModel(data.config.model);
      setApiTemperature(data.config.temperature);
      setApiMaxTokens(data.config.maxTokens);
      setApiHasKey(data.config.hasApiKey);
      setApiKey("");
      setApiTest("ok");
      setToast("API 已连接并安全保存在服务端");
    } catch (caught) {
      setApiTest("idle");
      setToast(caught instanceof Error ? caught.message : "API 连接失败");
    }
  };

  if (!loggedIn) {
    return <main className="yimeng-app login-screen" data-style={style} data-palette={palette} data-avatar-shape={avatarShape}>
      <div className="ambient ambient-one"/><div className="ambient ambient-two"/><div className="grain"/>
      <button className="login-theme-button" onClick={() => setPalette(current => current === "pink" ? "ink" : "pink")} aria-label="切换配色"><Icon name="moon" size={17}/><span>{palette === "pink" ? "粉色" : "黑白"}</span></button>
      <section className="login-stage">
        <div className="login-story">
          <div className="brand-mark brand-mark-large"><i/><i/><span>一</span></div>
          <p className="eyebrow">A SMALL WORLD FOR TWO</p><h1>一梦间</h1>
          <p className="login-poem">把平常的日子放进来，<br/>让朋友与故事里的人，都住在同一场梦里。</p>
          <div className="constellation" aria-hidden="true"><span/><span/><span/><span/><i/><i/></div>
          <div className="privacy-note"><Icon name="shield" size={16}/><span>仅受邀成员可见 · 私密共享空间</span></div>
        </div>
        {bootState === "loading" ? <section className="login-card panel login-loading"><span className="loader"/><div className="login-card-head"><p>正在唤醒一梦间</p><span>连接云端数据中……</span></div></section> : bootState === "setup" ? <form className="login-card panel setup-card" onSubmit={initialize}>
          <div className="login-card-head"><p>第一次打开一梦间</p><span>创建两套真实帐密，保存后你会直接以管理员身份进入</span></div>
          <div className="setup-person"><strong>你的帐户</strong><small>管理员</small></div>
          <label className="field-label" htmlFor="admin-name">显示名称</label>
          <div className="password-field"><Icon name="users" size={17}/><input id="admin-name" value={setupForm.adminName} onChange={event => setSetupForm(current => ({ ...current, adminName: event.target.value }))} maxLength={20}/></div>
          <label className="field-label" htmlFor="admin-password">登录密码</label>
          <div className="password-field"><Icon name="lock" size={17}/><input id="admin-password" type={showPassword ? "text" : "password"} value={setupForm.adminPassword} onChange={event => setSetupForm(current => ({ ...current, adminPassword: event.target.value }))} placeholder="至少 6 个字符" autoComplete="new-password"/><button type="button" onClick={() => setShowPassword(current => !current)} aria-label="显示密码"><Icon name="eye" size={17}/></button></div>
          <div className="setup-person"><strong>朋友的帐户</strong><small>普通成员</small></div>
          <label className="field-label" htmlFor="friend-name">显示名称</label>
          <div className="password-field"><Icon name="users" size={17}/><input id="friend-name" value={setupForm.friendName} onChange={event => setSetupForm(current => ({ ...current, friendName: event.target.value }))} maxLength={20}/></div>
          <label className="field-label" htmlFor="friend-password">登录密码</label>
          <div className="password-field"><Icon name="lock" size={17}/><input id="friend-password" type={showPassword ? "text" : "password"} value={setupForm.friendPassword} onChange={event => setSetupForm(current => ({ ...current, friendPassword: event.target.value }))} placeholder="至少 6 个字符" autoComplete="new-password"/></div>
          {authError && <p className="auth-error">{authError}</p>}
          <button className="primary-button login-submit" type="submit" disabled={authBusy || setupForm.adminPassword.length < 6 || setupForm.friendPassword.length < 6}><span>{authBusy ? "正在创建……" : "创建并进入一梦间"}</span><Icon name="chevron" size={18}/></button>
          <div className="prototype-note"><span>PRIVATE SETUP</span><p>密码只会以加密摘要保存在云端，请把朋友的密码单独告诉她。</p></div>
        </form> : <form className="login-card panel" onSubmit={login}>
          <div className="login-card-head"><p>欢迎回来</p><span>选择自己的身份并输入密码</span></div>
          <div className="profile-picker">
            {availableUsers.map(user => <button type="button" key={user.id} className={loginProfile === user.id ? "selected" : ""} onClick={() => { setLoginProfile(user.id); setAuthError(""); }}><Avatar initial={user.initial} color={user.color} size="lg" online={user.role === "admin"} src={displayAvatarSources[user.displayName]}/><span><strong>{user.displayName}</strong><small>{user.role === "admin" ? "管理员" : "普通成员"}</small></span><i className="profile-check"><Icon name="check" size={13}/></i></button>)}
          </div>
          <label className="field-label" htmlFor="password">密码</label>
          <div className="password-field"><Icon name="lock" size={17}/><input id="password" type={showPassword ? "text" : "password"} value={password} onChange={event => setPassword(event.target.value)} placeholder="请输入密码" autoComplete="current-password"/><button type="button" onClick={() => setShowPassword(current => !current)} aria-label="显示密码"><Icon name="eye" size={17}/></button></div>
          {authError && <p className="auth-error">{authError}</p>}
          <button className="primary-button login-submit" type="submit" disabled={authBusy || !password}><span>{authBusy ? "正在登录……" : "进入一梦间"}</span><Icon name="chevron" size={18}/></button>
          <div className="prototype-note"><span>CLOUD SYNC</span><p>真实帐密登录 · 动态、喜欢与回应会在两台设备间同步。</p></div>
        </form>}
      </section>
    </main>;
  }

  return <main className="yimeng-app app-screen" data-style={style} data-palette={palette} data-avatar-shape={avatarShape}>
    <div className="ambient ambient-one"/><div className="ambient ambient-two"/><div className="grain"/>
    <header className="topbar panel-soft">
      <button className="wordmark" type="button" onClick={() => goTo("feed")}><span className="brand-mark"><i/><i/><b>一</b></span><span><strong>一梦间</strong><small>只属于我们的片刻</small></span></button>
      {isAdmin ? <Segmented value={mode} onChange={toggleMode} options={[{ value: "life", label: "成员视角", icon: "eye" }, { value: "admin", label: "管理后台", icon: "settings" }]} small/> : <span className="member-view-badge"><Icon name="eye" size={15}/>成员视角</span>}
      <div className="top-actions"><div className="theme-wrap">
        <button className="icon-button theme-trigger" type="button" onClick={() => setThemeOpen(current => !current)} aria-label="切换外观"><span className="theme-swatch"/><Icon name="chevron" size={14}/></button>
        {themeOpen && <div className="theme-popover panel"><div><span className="popover-label">界面质感</span><Segmented value={style} onChange={value => setStyle(value as "glass" | "pixel")} options={[{ value: "glass", label: "毛玻璃", icon: "spark" }, { value: "pixel", label: "像素", icon: "grid" }]} small/></div><div><span className="popover-label">梦境配色</span><div className="palette-options"><button className={palette === "pink" ? "active" : ""} onClick={() => setPalette("pink")}><i className="pink-dot"/>柔粉</button><button className={palette === "ink" ? "active" : ""} onClick={() => setPalette("ink")}><i className="ink-dot"/>黑白</button></div></div></div>}
      </div><button className="profile-button" type="button" onClick={() => openProfile(currentUser.name)} aria-label={`打开${currentUser.name}的主页`}><Avatar initial={currentUser.initial} color={currentUser.color} size="sm" online src={displayAvatarSources[currentUser.name]}/><span>{currentUser.name}</span><Icon name="chevron" size={16}/></button><button className="icon-button logout-button" type="button" onClick={logout} aria-label="退出登录"><Icon name="logout" size={18}/></button></div>
    </header>

    {mode === "life" ? <div className="life-layout page-wrap">
      <aside className="side-rail panel-soft"><nav>{navItems.slice(0, 2).map(item => <button type="button" key={item.key} className={active === item.key ? "active" : ""} onClick={() => goTo(item.key)}><Icon name={item.icon}/><span>{item.label}</span></button>)}</nav><div className="rail-line"/><div className="rail-avatar-stack">{enabledCharacters.slice(0, 3).map(character => <button type="button" key={character.id} onClick={() => openProfile(character.name)} aria-label={`查看${character.name}的主页`}><Avatar initial={character.initial} color={character.color} size="sm" online src={displayAvatarSources[character.name]}/></button>)}</div>{isAdmin && <button className="rail-admin" type="button" onClick={() => toggleMode("admin")}><Icon name="settings"/><span>后台</span></button>}</aside>
      <section className="feed-column">
        <div className="feed-heading"><div><p className="eyebrow">PRIVATE SOCIAL DIARY</p><h1>一梦间</h1></div><span>{moments.length ? `${moments.length} 篇动态` : "云端已连接"}</span></div>
        <div className="story-strip panel" aria-label="成员近况">
          <button className="story-item your-story" type="button" onClick={() => openProfile(currentUser.name)}>
            <span className="story-ring"><Avatar initial={currentUser.initial} color={currentUser.color} size="lg" src={displayAvatarSources[currentUser.name]}/></span><i className="story-plus"><Icon name="plus" size={12}/></i><small>你的主页</small>
          </button>
          {otherUser && <button className="story-item" type="button" onClick={() => openProfile(otherUser.displayName)}><span className="story-ring"><Avatar initial={otherUser.initial} color={otherUser.color} size="lg" src={displayAvatarSources[otherUser.displayName]}/></span><small>{otherUser.displayName}</small></button>}
          {enabledCharacters.slice(0, 3).map(character => <button className="story-item" type="button" key={character.id} onClick={() => openProfile(character.name)}><span className="story-ring ai-story"><Avatar initial={character.initial} color={character.color} size="lg" src={displayAvatarSources[character.name]}/></span><small>{character.name}</small></button>)}
        </div>
        <button className="composer panel" type="button" onClick={openNewComposer}><Avatar initial={currentUser.initial} color={currentUser.color} size="sm" src={displayAvatarSources[currentUser.name]}/><span>分享此刻的照片或心情……</span><i><Icon name="image" size={18}/></i><b><Icon name="plus" size={17}/></b></button>
        <div className="feed-list">{moments.length === 0 && <div className="empty-feed panel"><span><Icon name="spark" size={25}/></span><h3>这里还很安静</h3><p>发布第一条动态后，它会同步到你们两个人的设备。</p></div>}{moments.map(moment => <article className={`moment-card panel ${moment.image ? "has-image" : "text-post"} ${postMenuId === moment.id ? "menu-open" : ""}`} key={moment.id}>
          <header>
            <button className="post-avatar-button" type="button" onClick={() => openProfile(moment.author)} aria-label={`查看${moment.author}的主页`}><span className="post-avatar-ring"><Avatar initial={moment.initial} color={moment.color} size="sm" src={displayAvatarSources[moment.author]}/></span></button>
            <div><div className="author-line"><button type="button" onClick={() => openProfile(moment.author)}>{moment.author}</button></div><small>{moment.time}</small></div>
            <div className="post-menu-wrap">
              <button type="button" className="bare-button" aria-label={`管理${moment.author}的动态`} aria-expanded={postMenuId === moment.id} onClick={() => setPostMenuId(current => current === moment.id ? null : moment.id)}><Icon name="more" size={21}/></button>
              {postMenuId === moment.id && <div className="post-menu panel" role="menu">
                <button type="button" onClick={() => { setPostMenuId(null); openProfile(moment.author); }}><Icon name="users" size={16}/><span>查看主页</span></button>
                {isAdmin && <button type="button" onClick={() => startAiReply(moment)}><Icon name="wand" size={16}/><span>让 AI 回应这条</span></button>}
                {canManageMoment(moment) && <button type="button" onClick={() => editMoment(moment)}><Icon name="edit" size={16}/><span>编辑动态</span></button>}
                <button type="button" onClick={() => copyMoment(moment)}><Icon name="send" size={16}/><span>复制文字</span></button>
                {canManageMoment(moment) && <button type="button" className="danger" onClick={() => void deleteMoment(moment)}><Icon name="trash" size={16}/><span>删除动态</span></button>}
              </div>}
            </div>
          </header>
          {moment.image && <MomentMedia image={moment.image} author={moment.author} onDoubleClick={() => toggleLike(moment.id)}/>} 
          {moment.text && <p className="moment-text"><span>{moment.text}</span></p>}
          <div className="moment-actions"><button type="button" aria-label="喜欢" className={moment.likedBy.includes(currentUser.name) ? "liked" : ""} onClick={() => toggleLike(moment.id)}><Icon name="heart" size={24}/></button><button type="button" aria-label="回应" onClick={() => setCommentBox(current => current === moment.id ? null : moment.id)}><Icon name="comment" size={23}/></button><button type="button" aria-label="分享" onClick={() => void shareMoment(moment)}><Icon name="send" size={23}/></button></div>
          {moment.likedBy.length > 0 && <div className="like-summary"><span className="mini-face">{moment.likedBy[0].slice(0, 1)}</span><p><strong>{moment.likedBy.length} 人喜欢</strong><small>{moment.likedBy.join("、")}</small></p></div>}
          {moment.comments.length > 0 && <button className="view-comments" type="button" onClick={() => setCommentBox(current => current === moment.id ? null : moment.id)}>查看全部 {moment.comments.length} 条回应</button>}
          {moment.comments.length > 0 && <div className="social-box">{moment.comments.map((comment, index) => <p key={`${comment.name}-${index}`}><strong>{comment.name}</strong><span>{comment.text}</span></p>)}</div>}
          <span className="post-time">{moment.time}</span>
          {commentBox === moment.id && <div className="comment-compose"><input autoFocus value={commentText} onChange={event => setCommentText(event.target.value)} onKeyDown={event => { if (event.key === "Enter") addComment(moment.id); }} placeholder={`回应 ${moment.author}…`}/><button type="button" onClick={() => addComment(moment.id)}><Icon name="send" size={15}/></button></div>}
        </article>)}</div>
      </section>
      <aside className="right-rail"><section className="dream-status panel"><div className="section-title"><div><Icon name="spark" size={17}/><span>此刻在线</span></div><small>{enabledCharacters.length + availableUsers.length} / {characters.length + availableUsers.length}</small></div><div className="online-list">{otherUser && <button type="button" onClick={() => openProfile(otherUser.displayName)}><Avatar initial={otherUser.initial} color={otherUser.color} size="sm" online src={displayAvatarSources[otherUser.displayName]}/><span><strong>{otherUser.displayName}</strong><small>受邀成员</small></span></button>}{enabledCharacters.slice(0, 3).map(character => <button type="button" key={character.id} onClick={() => openProfile(character.name)}><Avatar initial={character.initial} color={character.color} size="sm" online src={displayAvatarSources[character.name]}/><span><strong>{character.name}</strong><small>刚刚在线</small></span></button>)}</div></section>
        {isAdmin && <section className="quick-generate panel"><div className="magic-orbit"><Icon name="wand" size={24}/></div><p className="eyebrow">ADMIN SHORTCUT</p><h3>让角色写点什么</h3><p>一次生成多位角色的朋友圈，各自保存成草稿。</p><button className="secondary-button" type="button" onClick={() => goTo("generate")}><span>进入生成所</span><Icon name="chevron" size={16}/></button></section>}
        <section className="tiny-note"><span>今日小笺</span><p>“梦不必很大，够两个人一起记住就好。”</p></section>
      </aside>
    </div> : <div className="admin-layout page-wrap">
      <aside className="admin-nav panel"><div className="admin-nav-title"><span>ADMIN ROOM</span><strong>一梦间管理室</strong></div><nav>{navItems.slice(1).map(item => <button type="button" key={item.key} className={active === item.key ? "active" : ""} onClick={() => setActive(item.key)}><Icon name={item.icon}/><span>{item.label === "生成" ? "批量生成" : item.label}</span>{item.key === "generate" && drafts.length > 0 && <b>{drafts.length}</b>}{item.key === "replies" && replyDrafts.length > 0 && <b>{replyDrafts.length}</b>}</button>)}</nav><div className="admin-safe"><Icon name="shield" size={17}/><p><strong>私密管理区</strong><span>普通成员看不到这里</span></p></div><button className="back-to-feed" type="button" onClick={() => toggleMode("life")}><Icon name="eye" size={17}/><span>返回成员视角</span></button></aside>
      <section className="admin-content">
        {active === "generate" && <GeneratePanel characters={characters} selected={selectedCharacters} toggleSelected={toggleCharacterSelection} batchState={batchState} runBatch={runBatch} drafts={drafts} setDrafts={setDrafts} publishDraft={publishDraft} publishAll={publishAllDrafts} avatarSources={displayAvatarSources} prompt={generationPrompt} setPrompt={setGenerationPrompt}/>} 
        {active === "replies" && <RepliesPanel moments={moments} characters={characters} selectedMomentId={replyMomentId} selectMoment={selectReplyMoment} selectedCharacters={replyCharacterIds} toggleCharacter={toggleReplyCharacter} batchState={replyBatchState} runBatch={runReplyBatch} drafts={replyDrafts} setDrafts={setReplyDrafts} publishDraft={publishReplyDraft} publishAll={publishAllReplyDrafts} avatarSources={displayAvatarSources} prompt={replyPrompt} setPrompt={setReplyPrompt}/>} 
        {active === "characters" && <CharactersPanel characters={characters} openCreate={openCreateCharacter} openImport={() => importRef.current?.click()} avatarSources={displayAvatarSources} openProfile={openProfile} editCharacter={openEditCharacter} toggleCharacter={toggleCharacterEnabled} deleteCharacter={deleteCharacter}/>} 
        {active === "worldbook" && <WorldbookPanel entries={worldEntries} openCreate={openCreateWorld} characters={characters} toggleEntry={toggleWorldEntry} editEntry={openEditWorld} deleteEntry={deleteWorldEntry}/>} 
        {active === "api" && <ApiPanel apiBase={apiBase} setApiBase={setApiBase} apiKey={apiKey} setApiKey={setApiKey} model={model} setModel={setModel} hasKey={apiHasKey} temperature={apiTemperature} setTemperature={setApiTemperature} maxTokens={apiMaxTokens} setMaxTokens={setApiMaxTokens} state={apiTest} test={testApi}/>} 
      </section>
    </div>}

    <nav className="mobile-nav panel-soft" aria-label="主导航">
      <button type="button" className={mode === "life" ? "active" : ""} onClick={() => goTo("feed")} aria-label="首页"><Icon name="home" size={23}/><span>首页</span></button>
      <button type="button" onClick={() => setToast("暂时没有新的提醒")} aria-label="动态提醒"><Icon name="heart" size={23}/><span>动态</span></button>
      <button type="button" className="mobile-create" onClick={openNewComposer} aria-label="发布朋友圈"><Icon name="plus" size={24}/><span>发布</span></button>
      <button type="button" className={active === "generate" ? "active" : ""} onClick={() => isAdmin ? goTo("generate") : setToast("角色们正在梦里散步")} aria-label="角色"><Icon name="spark" size={23}/><span>角色</span></button>
      <button type="button" onClick={() => openProfile(currentUser.name)} aria-label="我的主页"><Avatar initial={currentUser.initial} color={currentUser.color} size="sm" src={displayAvatarSources[currentUser.name]}/><span>我的</span></button>
    </nav>

    {profileInfo && <div className="profile-layer" role="dialog" aria-modal="true" aria-label={`${profileInfo.name}的个人主页`}>
      <section className="profile-page">
        <header className="profile-nav">
          <button type="button" className="profile-back" onClick={() => setProfileName(null)} aria-label="返回动态"><Icon name="chevron" size={22}/></button>
          <div><strong>{profileInfo.name}</strong><span>成员主页</span></div>
          <span aria-hidden="true"/>
        </header>
        <div className="profile-hero">
          <div className="profile-avatar-wrap">
            <span className="profile-avatar-ring"><Avatar initial={profileInfo.initial} color={profileInfo.color} size="xl" online src={displayAvatarSources[profileInfo.name]}/></span>
            {canChangeProfileAvatar && <button type="button" className="avatar-edit-button" onClick={() => chooseAvatar(profileInfo.name)} aria-label={`更换${profileInfo.name}的头像`}><Icon name="image" size={15}/></button>}
          </div>
          <div className="profile-copy"><div className="profile-name-line"><h2>{profileInfo.name}</h2></div><p>{profileInfo.bio}</p><small>{profileInfo.detail}</small></div>
        </div>
        <div className="profile-stats"><div><strong>{profileMoments.length}</strong><span>动态</span></div><div><strong>{profileLikes}</strong><span>获赞</span></div><div><strong>在线</strong><span>状态</span></div></div>
        <div className="profile-actions">
          {canChangeProfileAvatar && <button type="button" className="profile-main-action" onClick={() => chooseAvatar(profileInfo.name)}><Icon name="image" size={16}/><span>更换头像</span></button>}
          {isOwnProfile && <button type="button" onClick={openSignatureEditor}><Icon name="edit" size={16}/><span>编辑签名</span></button>}
          {isAdmin && profileInfo.role === "AI 成员" && <button type="button" onClick={() => { setProfileName(null); goTo("generate"); }}><Icon name="wand" size={16}/><span>生成动态</span></button>}
          {isAdmin && profileInfo.role === "AI 成员" && <button type="button" onClick={() => { const character = characters.find(item => item.name === profileInfo.name); if (character) openEditCharacter(character); }}><Icon name="edit" size={16}/><span>编辑角色</span></button>}
          {isAdmin && profileInfo.role === "AI 成员" && <button type="button" className="profile-danger-action" onClick={() => { const character = characters.find(item => item.name === profileInfo.name); if (character) void deleteCharacter(character); }}><Icon name="trash" size={16}/><span>删除角色</span></button>}
          {!canChangeProfileAvatar && <span className="profile-shared-note"><Icon name="shield" size={14}/>你们共同生活在一梦间</span>}
        </div>
        {isOwnProfile && <section className="avatar-display-setting" aria-label="头像显示形状">
          <div><strong>头像形状</strong><small>只改变你在这台设备看到的样子</small></div>
          <div className="avatar-shape-options" role="group" aria-label="选择头像形状">{avatarShapeOptions.map(option => <button type="button" key={option.value} className={avatarShape === option.value ? "active" : ""} aria-pressed={avatarShape === option.value} onClick={() => updateAvatarShape(option.value)}><i className={`shape-swatch shape-${option.value}`}/><span>{option.label}</span></button>)}</div>
        </section>}
        <div className="profile-tabs" role="tablist"><button type="button" role="tab" aria-selected={profileTab === "grid"} className={profileTab === "grid" ? "active" : ""} onClick={() => setProfileTab("grid")}><Icon name="grid" size={17}/><span>图片墙</span></button><button type="button" role="tab" aria-selected={profileTab === "timeline"} className={profileTab === "timeline" ? "active" : ""} onClick={() => setProfileTab("timeline")}><Icon name="comment" size={17}/><span>全部动态</span></button></div>
        {profileMoments.length === 0 ? <div className="profile-empty"><span><Icon name="image" size={28}/></span><h3>还没有发布动态</h3><p>第一条动态会出现在这里。</p></div> : profileTab === "grid" ? <div className="profile-grid">{profileMoments.map(moment => <article className={`profile-tile ${moment.image ? "has-art" : "text-only"}`} key={moment.id}>{moment.image ? <MomentMedia image={moment.image} author={moment.author}/> : <p>{moment.text}</p>}<div className="tile-overlay"><span><Icon name="heart" size={15}/>{moment.likedBy.length}</span><span><Icon name="comment" size={15}/>{moment.comments.length}</span></div></article>)}</div> : <div className="profile-timeline">{profileMoments.map(moment => <article key={moment.id}>{moment.image && <MomentMedia image={moment.image} author={moment.author}/>}<header><span>{moment.time}</span><b>{moment.comments.length} 条回应</b></header>{moment.text && <p>{moment.text}</p>}<footer><span><Icon name="heart" size={14}/>{moment.likedBy.length}</span><span><Icon name="comment" size={14}/>{moment.comments.length}</span></footer></article>)}</div>}
        {isOwnProfile && <p className="avatar-local-note">头像图片会保存到一梦间并同步；头像形状仍只影响你自己的显示。</p>}
      </section>
    </div>}

    {composerOpen && <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) { setComposerOpen(false); setEditingMomentId(null); clearComposerImage(); } }}><section className="modal-card composer-modal panel"><header><div><p className="eyebrow">{editingMomentId ? "EDIT MOMENT" : "NEW MOMENT"}</p><h2>{editingMomentId ? "编辑这条动态" : "写下这个片刻"}</h2></div><button className="icon-button" onClick={() => { setComposerOpen(false); setEditingMomentId(null); clearComposerImage(); }}><Icon name="close"/></button></header><div className="composer-author"><Avatar initial={editingMoment?.initial || currentUser.initial} color={editingMoment?.color || currentUser.color} size="md" src={displayAvatarSources[editingMoment?.author || currentUser.name]}/><div><strong>{editingMoment?.author || currentUser.name}</strong><span>保存后所有受邀成员都会看到</span></div></div>{!editingMomentId && composerImagePreview && <div className="composer-image-preview" style={{ backgroundImage: `url(${JSON.stringify(composerImagePreview)})` }}><button type="button" onClick={clearComposerImage}><Icon name="close" size={14}/><span>移除图片</span></button></div>}<textarea autoFocus value={composerText} onChange={event => setComposerText(event.target.value)} placeholder={composerImage ? "给这张图片写点什么……（也可以留空）" : "今天发生了什么？"} maxLength={600}/><div className="composer-tools">{editingMomentId ? <span>{editingMoment?.image ? "修改文字，原有图片会保留" : "正在修改已发布内容"}</span> : <button type="button" onClick={() => momentImageInputRef.current?.click()}><Icon name="image" size={16}/><span>{composerImage ? "更换图片" : "添加图片"}</span></button>}<span>{composerText.length} / 600</span></div><footer><button className="ghost-button" onClick={() => { setComposerOpen(false); setEditingMomentId(null); clearComposerImage(); }}>{editingMomentId ? "取消修改" : "先不写了"}</button><button className="primary-button" disabled={!composerText.trim() && !composerImage && !editingMoment?.image} onClick={publishMoment}><Icon name={editingMomentId ? "check" : "send"} size={17}/><span>{editingMomentId ? "保存修改" : "发布朋友圈"}</span></button></footer></section></div>}

    {characterModal && <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) { setCharacterModal(false); setEditingCharacterId(null); } }}><section className="modal-card panel form-modal"><header><div><p className="eyebrow">{editingCharacterId ? "EDIT AI MEMBER" : "NEW AI MEMBER"}</p><h2>{editingCharacterId ? "编辑 AI 成员" : "创建 AI 成员"}</h2></div><button className="icon-button" onClick={() => { setCharacterModal(false); setEditingCharacterId(null); }}><Icon name="close"/></button></header><div className="avatar-seed"><span>{newCharacter.name.slice(0, 1) || "?"}</span><p>{editingCharacterId ? "修改后会保存到云端" : "头像可在创建后上传"}</p></div><label><span>角色名</span><input value={newCharacter.name} onChange={event => setNewCharacter(current => ({ ...current, name: event.target.value }))} placeholder="例如：南枝" maxLength={20}/></label><label><span>角色设定</span><textarea value={newCharacter.description} onChange={event => setNewCharacter(current => ({ ...current, description: event.target.value }))} placeholder="性格、经历、说话方式、喜好……" maxLength={8000}/></label><label><span>初次介绍 <small>选填</small></span><input value={newCharacter.greeting} onChange={event => setNewCharacter(current => ({ ...current, greeting: event.target.value }))} placeholder="角色加入时显示的一句话" maxLength={1000}/></label><footer><button className="ghost-button" onClick={() => { setCharacterModal(false); setEditingCharacterId(null); }}>取消</button><button className="primary-button" disabled={characterBusy || !newCharacter.name.trim()} onClick={saveCharacter}><Icon name={editingCharacterId ? "check" : "plus"} size={17}/><span>{characterBusy ? "正在保存……" : editingCharacterId ? "保存修改" : "创建并保存"}</span></button></footer></section></div>}

    {signatureModal && <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setSignatureModal(false); }}><section className="modal-card panel signature-modal"><header><div><p className="eyebrow">PROFILE SIGNATURE</p><h2>编辑个性签名</h2></div><button className="icon-button" onClick={() => setSignatureModal(false)}><Icon name="close"/></button></header><textarea autoFocus value={signatureDraft} onChange={event => setSignatureDraft(event.target.value)} placeholder="写一句想让朋友看到的话……" maxLength={120}/><div className="signature-count">{signatureDraft.length} / 120</div><footer><button className="ghost-button" onClick={() => setSignatureModal(false)}>取消</button><button className="primary-button" disabled={signatureBusy} onClick={saveSignature}><Icon name="check" size={17}/><span>{signatureBusy ? "正在保存……" : "保存签名"}</span></button></footer></section></div>}

    {worldModal && <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) { setWorldModal(false); setEditingWorldId(null); } }}><section className="modal-card panel form-modal"><header><div><p className="eyebrow">{editingWorldId ? "EDIT LORE ENTRY" : "NEW LORE ENTRY"}</p><h2>{editingWorldId ? "编辑世界书条目" : "添加世界书条目"}</h2></div><button className="icon-button" onClick={() => { setWorldModal(false); setEditingWorldId(null); }}><Icon name="close"/></button></header><div className="form-grid"><label><span>条目名称</span><input value={worldForm.title} onChange={event => setWorldForm(current => ({ ...current, title: event.target.value }))} placeholder="例如：雾港的冬天" maxLength={80}/></label><label><span>作用范围</span><select value={worldForm.scope} onChange={event => setWorldForm(current => ({ ...current, scope: event.target.value }))}><option>全局</option>{characters.map(character => <option key={character.id}>{character.name}</option>)}</select></label></div><div className="form-grid"><label><span>激活方式</span><select value={worldForm.trigger} onChange={event => setWorldForm(current => ({ ...current, trigger: event.target.value }))}><option>关键词</option><option>常驻</option></select></label><label><span>关键词</span><input value={worldForm.keys} onChange={event => setWorldForm(current => ({ ...current, keys: event.target.value }))} disabled={worldForm.trigger === "常驻"} placeholder="用逗号分隔" maxLength={300}/></label></div><label><span>插入位置</span><input value={worldForm.position} onChange={event => setWorldForm(current => ({ ...current, position: event.target.value }))} maxLength={80}/></label><label><span>条目内容</span><textarea value={worldForm.content} onChange={event => setWorldForm(current => ({ ...current, content: event.target.value }))} placeholder="AI 需要知道的设定、记忆或规则……" maxLength={8000}/></label><footer><button className="ghost-button" onClick={() => { setWorldModal(false); setEditingWorldId(null); }}>取消</button><button className="primary-button" disabled={worldBusy || !worldForm.title.trim() || !worldForm.content.trim()} onClick={saveWorldEntry}><Icon name={editingWorldId ? "check" : "plus"} size={17}/><span>{worldBusy ? "正在保存……" : editingWorldId ? "保存修改" : "保存条目"}</span></button></footer></section></div>}

    <input ref={importRef} className="visually-hidden" type="file" accept=".json,.png,application/json,image/png" onChange={importCharacter}/><input ref={avatarInputRef} className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={updateAvatar}/><input ref={momentImageInputRef} className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseMomentImage}/>{toast && <div className="toast panel"><span><Icon name="check" size={16}/></span><p>{toast}</p></div>}
  </main>;
}

function AdminHeading({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
  return <div className="admin-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>{actions && <div className="heading-actions">{actions}</div>}</div>;
}

function GeneratePanel({ characters, selected, toggleSelected, batchState, runBatch, drafts, setDrafts, publishDraft, publishAll, avatarSources, prompt, setPrompt }: { characters: Character[]; selected: string[]; toggleSelected: (id: string) => void; batchState: string; runBatch: () => void; drafts: Draft[]; setDrafts: React.Dispatch<React.SetStateAction<Draft[]>>; publishDraft: (id: string) => void; publishAll: () => void; avatarSources: Record<string, string>; prompt: string; setPrompt: (value: string) => void }) {
  return <div className="admin-page"><AdminHeading eyebrow="AI MOMENT STUDIO" title="批量生成朋友圈" description="一次请求生成多位角色，各自拆分成可编辑草稿，确认后才会出现在朋友圈。" actions={<span className="draft-count"><Icon name="edit" size={15}/>{drafts.length} 份待确认</span>}/><div className="generate-grid">
    <section className="generation-setup panel"><div className="block-title"><span>01</span><div><strong>选择角色</strong><small>本次谁来写朋友圈</small></div><button type="button" onClick={() => selected.length === characters.length ? characters.forEach(character => selected.includes(character.id) && toggleSelected(character.id)) : characters.filter(character => !selected.includes(character.id)).forEach(character => toggleSelected(character.id))}>{selected.length === characters.length ? "清空" : "全选"}</button></div>
      <div className="character-check-grid">{characters.map(character => <button type="button" key={character.id} className={selected.includes(character.id) ? "selected" : ""} onClick={() => toggleSelected(character.id)}><Avatar initial={character.initial} color={character.color} size="md" src={avatarSources[character.name]}/><span><strong>{character.name}</strong><small>{character.book}</small></span><i>{selected.includes(character.id) && <Icon name="check" size={14}/>}</i></button>)}</div><div className="divider"/>
      <div className="block-title"><span>02</span><div><strong>生成要求</strong><small>会与每个角色人设和世界书合并</small></div></div><textarea className="prompt-box" value={prompt} onChange={event => setPrompt(event.target.value)} maxLength={2000}/>
      <div className="generation-options"><label><span>每位生成</span><select defaultValue="1"><option value="1">1 条草稿</option><option value="2">2 条草稿</option></select></label><label><span>时间氛围</span><select defaultValue="auto"><option value="auto">跟随现在</option><option>清晨</option><option>午后</option><option>深夜</option></select></label><label><span>长度</span><select defaultValue="short"><option value="short">短 · 40–100 字</option><option>中 · 100–200 字</option></select></label></div>
      <div className="context-preview"><Icon name="book" size={18}/><div><strong>上下文会自动装配</strong><span>共用世界书 → 角色专属世界书 → 角色卡 → 生成要求 → JSON 输出格式</span></div></div><button className="primary-button generate-button" type="button" disabled={batchState === "running"} onClick={runBatch}>{batchState === "running" ? <><span className="loader"/>正在召集角色…</> : <><Icon name="wand" size={18}/><span>一次生成 {selected.length} 位角色</span></>}</button>
    </section>
    <section className="draft-studio"><div className="draft-head"><div><strong>草稿桌</strong><span>{drafts.length ? `已分拆为 ${drafts.length} 份独立内容` : "生成后会安静地放在这里"}</span></div>{drafts.length > 1 && <button className="secondary-button" onClick={publishAll}><Icon name="send" size={15}/><span>全部发布</span></button>}</div>{!drafts.length && batchState !== "running" && <div className="empty-drafts panel"><div><Icon name="spark" size={26}/></div><h3>还没有草稿</h3><p>左边选择角色并开始生成。<br/>任何内容都不会自动发布。</p></div>}{batchState === "running" && <div className="generating-card panel"><div className="signal"><i/><i/><i/></div><h3>角色们正在写……</h3><p>同一次 API 请求，返回结构化角色数组。</p><div className="progress"><span/></div></div>}<div className="draft-list">{drafts.map((draft, index) => <article className="draft-card panel" key={draft.id}><header><Avatar initial={draft.initial} color={draft.color} size="md" src={avatarSources[draft.author]}/><div><strong>{draft.author}</strong><span>草稿 {String(index + 1).padStart(2, "0")}</span></div><button type="button" onClick={() => setDrafts(current => current.filter(item => item.id !== draft.id))}><Icon name="trash" size={17}/></button></header><textarea value={draft.text} onChange={event => setDrafts(current => current.map(item => item.id === draft.id ? { ...item, text: event.target.value } : item))}/><footer><span>{draft.text.length} 字 · 可编辑</span><button className="mini-primary" type="button" onClick={() => publishDraft(draft.id)}><Icon name="send" size={14}/><span>确认发布</span></button></footer></article>)}</div></section>
  </div></div>;
}

function RepliesPanel({ moments, characters, selectedMomentId, selectMoment, selectedCharacters, toggleCharacter, batchState, runBatch, drafts, setDrafts, publishDraft, publishAll, avatarSources, prompt, setPrompt }: {
  moments: Moment[];
  characters: Character[];
  selectedMomentId: string;
  selectMoment: (id: string) => void;
  selectedCharacters: string[];
  toggleCharacter: (id: string) => void;
  batchState: string;
  runBatch: () => void;
  drafts: ReplyDraft[];
  setDrafts: React.Dispatch<React.SetStateAction<ReplyDraft[]>>;
  publishDraft: (id: string) => void;
  publishAll: () => void;
  avatarSources: Record<string, string>;
  prompt: string;
  setPrompt: (value: string) => void;
}) {
  const [search, setSearch] = useState("");
  const target = moments.find(moment => moment.id === selectedMomentId) ?? moments[0];
  const responders = characters.filter(character => character.enabled && character.name !== target?.author);
  const normalizedSearch = search.trim().toLocaleLowerCase("zh-CN");
  const matchingMoments = moments.filter(moment => !normalizedSearch || `${moment.author} ${moment.text}`.toLocaleLowerCase("zh-CN").includes(normalizedSearch));
  const visibleMoments = [...matchingMoments].sort((left, right) => left.id === selectedMomentId ? -1 : right.id === selectedMomentId ? 1 : 0).slice(0, 20);
  const allSelected = responders.length > 0 && responders.every(character => selectedCharacters.includes(character.id));
  const toggleAll = () => responders.forEach(character => {
    if (allSelected ? selectedCharacters.includes(character.id) : !selectedCharacters.includes(character.id)) toggleCharacter(character.id);
  });

  return <div className="admin-page reply-page">
    <AdminHeading eyebrow="AI REPLY STUDIO" title="让角色回应朋友圈" description="选择任意成员的动态，再一次生成多位角色的回应。每条回复都可以修改，确认后才会出现在评论区。" actions={<span className="draft-count"><Icon name="comment" size={15}/>{drafts.length} 份待确认</span>}/>
    <div className="reply-workspace">
      <section className="generation-setup reply-setup panel">
        <div className="block-title"><span>01</span><div><strong>选择朋友圈</strong><small>也可以从首页动态的三点菜单直接进入</small></div></div>
        <label className="reply-search"><Icon name="search" size={16}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="搜索发布者或动态内容"/><span>{matchingMoments.length} 条</span></label>
        <div className="reply-target-list">{visibleMoments.map(moment => <button type="button" key={moment.id} className={`reply-target ${selectedMomentId === moment.id ? "selected" : ""}`} onClick={() => selectMoment(moment.id)}>
          <Avatar initial={moment.initial} color={moment.color} size="sm" src={avatarSources[moment.author]}/>
          <span><span className="reply-target-head"><strong>{moment.author}</strong><small>{moment.time}</small></span><p>{moment.text}</p><small>{moment.comments.length} 条现有回应{moment.image ? " · 含图片" : ""}</small></span>
          <i>{selectedMomentId === moment.id && <Icon name="check" size={14}/>}</i>
        </button>)}{visibleMoments.length === 0 && <div className="reply-search-empty">没有找到相关动态</div>}</div>
        <div className="divider"/>
        <div className="block-title"><span>02</span><div><strong>选择回应角色</strong><small>原动态作者不会回应自己</small></div><button type="button" onClick={toggleAll}>{allSelected ? "清空" : "全选"}</button></div>
        <div className="character-check-grid">{characters.map(character => {
          const disabled = !character.enabled || character.name === target?.author;
          return <button type="button" key={character.id} disabled={disabled} className={selectedCharacters.includes(character.id) && !disabled ? "selected" : ""} onClick={() => toggleCharacter(character.id)}><Avatar initial={character.initial} color={character.color} size="md" src={avatarSources[character.name]}/><span><strong>{character.name}</strong><small>{disabled ? character.name === target?.author ? "原动态作者" : "当前已暂停" : character.book}</small></span><i>{selectedCharacters.includes(character.id) && !disabled && <Icon name="check" size={14}/>}</i></button>;
        })}</div>
        <div className="divider"/>
        <div className="block-title"><span>03</span><div><strong>回应要求</strong><small>会与动态正文、已有评论、人设和世界书一起发送</small></div></div>
        <textarea className="prompt-box reply-prompt" value={prompt} onChange={event => setPrompt(event.target.value)} maxLength={2000}/>
        {target && <div className="context-preview"><Icon name="book" size={18}/><div><strong>本次上下文</strong><span>{target.author}的动态 → {target.comments.length} 条已有回应 → 角色卡 → 角色世界书 → 回应要求</span></div></div>}
        <button className="primary-button generate-button" type="button" disabled={batchState === "running" || !target} onClick={runBatch}>{batchState === "running" ? <><span className="loader"/>正在组织回应…</> : <><Icon name="wand" size={18}/><span>生成 {selectedCharacters.filter(id => responders.some(character => character.id === id)).length} 条回应</span></>}</button>
      </section>
      <section className="draft-studio reply-drafts">
        <div className="draft-head"><div><strong>回应草稿</strong><span>{target ? `正在回应 ${target.author} 的朋友圈` : "先选择一条朋友圈"}</span></div>{drafts.length > 1 && <button className="secondary-button" type="button" onClick={publishAll}><Icon name="send" size={15}/><span>全部发布</span></button>}</div>
        {!drafts.length && batchState !== "running" && <div className="empty-drafts panel"><div><Icon name="comment" size={26}/></div><h3>还没有回应草稿</h3><p>选择朋友圈和回应角色后开始生成。<br/>回复不会自动出现在评论区。</p></div>}
        {batchState === "running" && <div className="generating-card panel"><div className="signal"><i/><i/><i/></div><h3>角色们正在读这条动态……</h3><p>同一次请求会返回多位角色各自的回应。</p><div className="progress"><span/></div></div>}
        <div className="draft-list">{drafts.map((draft, index) => <article className="draft-card panel" key={draft.id}><header><Avatar initial={draft.initial} color={draft.color} size="md" src={avatarSources[draft.author]}/><div><strong>{draft.author}</strong><span>回应草稿 {String(index + 1).padStart(2, "0")}</span></div><button type="button" onClick={() => setDrafts(current => current.filter(item => item.id !== draft.id))} aria-label={`删除${draft.author}的回应草稿`}><Icon name="trash" size={17}/></button></header><textarea value={draft.text} onChange={event => setDrafts(current => current.map(item => item.id === draft.id ? { ...item, text: event.target.value } : item))}/><footer><span>{draft.text.length} 字 · 可编辑</span><button className="mini-primary" type="button" disabled={!draft.text.trim()} onClick={() => publishDraft(draft.id)}><Icon name="send" size={14}/><span>发布回应</span></button></footer></article>)}</div>
      </section>
    </div>
  </div>;
}

function CharactersPanel({ characters, openCreate, openImport, avatarSources, openProfile, editCharacter, toggleCharacter, deleteCharacter }: { characters: Character[]; openCreate: () => void; openImport: () => void; avatarSources: Record<string, string>; openProfile: (name: string) => void; editCharacter: (character: Character) => void; toggleCharacter: (character: Character) => void; deleteCharacter: (character: Character) => void }) {
  return <div className="admin-page"><AdminHeading eyebrow="AI MEMBERS" title="AI 成员" description="创建自己的角色，或导入酒馆角色卡；每位成员都能绑定独立世界书。" actions={<><button className="secondary-button" onClick={openImport}><Icon name="upload" size={16}/><span>导入角色卡</span></button><button className="primary-button" onClick={openCreate}><Icon name="plus" size={16}/><span>新建成员</span></button></>}/><div className="import-hint panel-soft"><div><Icon name="upload" size={20}/></div><p><strong>可直接导入 SillyTavern 角色卡</strong><span>支持 JSON / PNG；会解析角色描述、性格、场景、示例对话、头像及卡内世界书，并保存到云端。</span></p><button onClick={openImport}>选择文件</button></div>
    {characters.length === 0 && <div className="empty-characters panel"><Icon name="users" size={27}/><h3>还没有 AI 成员</h3><p>可以新建角色，也可以导入酒馆角色卡。</p><button className="primary-button" type="button" onClick={openCreate}><Icon name="plus" size={16}/><span>新建第一个角色</span></button></div>}
    {characters.length > 0 && <div className="character-table panel"><div className="table-head"><span>成员</span><span>角色设定摘要</span><span>世界书</span><span>状态</span><span>管理</span></div>{characters.map(character => <div className="character-row" key={character.id}><button type="button" className="character-cell" onClick={() => openProfile(character.name)}><Avatar initial={character.initial} color={character.color} size="md" online={character.enabled} src={avatarSources[character.name]}/><span><strong>{character.name}</strong><small>AI 成员</small></span></button><p>{character.note}</p><span className="book-chip"><Icon name="book" size={13}/>{character.book}</span><div className="status-cell"><Switch checked={character.enabled} onChange={() => toggleCharacter(character)} label={`${character.enabled ? "停用" : "启用"}${character.name}`}/><small>{character.enabled ? "启用" : "暂停"}</small></div><div className="character-actions"><button type="button" onClick={() => editCharacter(character)} aria-label={`编辑${character.name}`}><Icon name="edit" size={16}/><span>编辑</span></button><button type="button" className="danger" onClick={() => deleteCharacter(character)} aria-label={`删除${character.name}`}><Icon name="trash" size={16}/><span>删除</span></button></div></div>)}</div>}
    {characters.length > 0 && <div className="character-cards-mobile">{characters.map(character => <article className="panel" key={character.id}><header><button type="button" className="mobile-character-link" onClick={() => openProfile(character.name)}><Avatar initial={character.initial} color={character.color} size="md" online={character.enabled} src={avatarSources[character.name]}/><div><strong>{character.name}</strong><small>{character.book}</small></div></button><Switch checked={character.enabled} onChange={() => toggleCharacter(character)} label="切换成员状态"/></header><p>{character.note}</p><footer><button type="button" onClick={() => editCharacter(character)}><Icon name="edit" size={15}/><span>编辑并保存</span></button><button type="button" className="danger" onClick={() => deleteCharacter(character)}><Icon name="trash" size={15}/><span>删除角色</span></button></footer></article>)}</div>}
  </div>;
}

type WorldEntry = { id: string; title: string; scope: string; trigger: string; keys: string; position: string; enabled: boolean; content: string };

function WorldbookPanel({ entries, openCreate, characters, toggleEntry, editEntry, deleteEntry }: { entries: WorldEntry[]; openCreate: () => void; characters: Character[]; toggleEntry: (entry: WorldEntry) => void; editEntry: (entry: WorldEntry) => void; deleteEntry: (entry: WorldEntry) => void }) {
  const [scope, setScope] = useState("all");
  const filtered = scope === "all" ? entries : entries.filter(entry => scope === "global" ? entry.scope === "全局" : scope.startsWith("character:") && scope !== "character:any" ? entry.scope === scope.slice(10) : entry.scope !== "全局");
  const segmentScope = scope.startsWith("character:") ? "character" : scope;
  return <div className="admin-page"><AdminHeading eyebrow="LORE & MEMORY" title="世界书" description="把设定、共同记忆和触发规则装进生成上下文。可全局生效，也可只绑定某个角色。" actions={<button className="primary-button" onClick={openCreate}><Icon name="plus" size={16}/><span>添加条目</span></button>}/><div className="world-toolbar panel-soft"><Segmented value={segmentScope} onChange={value => setScope(value === "character" ? "character:any" : value)} options={[{ value: "all", label: "全部条目" }, { value: "global", label: "全局" }, { value: "character", label: "角色专属" }]} small/><div className="world-budget"><span>已同步</span><strong>{entries.length} 条</strong><i/><span>上下文</span><strong>自动装配</strong></div></div><div className="world-layout">
    <aside className="book-list panel"><div className="book-cover"><Icon name="book" size={21}/><div><strong>一梦间 · 共用世界书</strong><span>{entries.filter(entry => entry.scope === "全局").length} 个全局条目</span></div></div><button type="button" className={scope === "global" ? "active" : ""} onClick={() => setScope("global")}><span>共用世界书</span><b>{entries.filter(entry => entry.scope === "全局").length}</b></button><p>角色专属</p>{characters.map(character => <button type="button" className={scope === `character:${character.name}` ? "active" : ""} onClick={() => setScope(`character:${character.name}`)} key={character.id}><span>{character.name}</span><b>{entries.filter(entry => entry.scope === character.name).length}</b></button>)}</aside>
    <section className="entry-list">{filtered.map(entry => <article className={`lore-entry panel ${entry.enabled ? "" : "disabled"}`} key={entry.id}><header><div className="entry-index">{String(entries.indexOf(entry) + 1).padStart(2, "0")}</div><div><strong>{entry.title}</strong><span><b className={entry.scope === "全局" ? "global" : "character"}>{entry.scope}</b><i>{entry.trigger}</i></span></div><div className="lore-actions"><button type="button" onClick={() => editEntry(entry)} aria-label={`编辑${entry.title}`}><Icon name="edit" size={15}/></button><button type="button" className="danger" onClick={() => deleteEntry(entry)} aria-label={`删除${entry.title}`}><Icon name="trash" size={15}/></button><Switch checked={entry.enabled} onChange={() => toggleEntry(entry)} label="切换世界书条目"/></div></header><p>{entry.content}</p><footer>{entry.trigger === "关键词" && <span><strong>关键词</strong>{entry.keys}</span>}<span><strong>插入位置</strong>{entry.position}</span><span><strong>优先级</strong>100</span></footer></article>)}</section>
  </div></div>;
}

function ApiPanel({ apiBase, setApiBase, apiKey, setApiKey, model, setModel, hasKey, temperature, setTemperature, maxTokens, setMaxTokens, state, test }: { apiBase: string; setApiBase: (value: string) => void; apiKey: string; setApiKey: (value: string) => void; model: string; setModel: (value: string) => void; hasKey: boolean; temperature: number; setTemperature: (value: number) => void; maxTokens: number; setMaxTokens: (value: number) => void; state: "idle" | "testing" | "ok"; test: () => void }) {
  return <div className="admin-page api-page"><AdminHeading eyebrow="MODEL CONNECTION" title="OpenAI 兼容接口" description="接入支持 OpenAI Chat Completions 格式的模型服务，用于生成回复与角色朋友圈。" actions={<span className={`connection-badge ${state === "ok" ? "ok" : ""}`}><i/>{state === "ok" ? "已连接并保存" : "尚未连接"}</span>}/><div className="api-layout">
    <section className="api-form panel"><div className="api-form-head"><span><Icon name="plug" size={20}/></span><div><strong>默认模型连接</strong><small>全站 AI 生成任务共用</small></div></div><label><span>Base URL</span><small>填写到 /v1；也兼容完整 /chat/completions 地址</small><input value={apiBase} onChange={event => setApiBase(event.target.value)} placeholder="https://api.example.com/v1"/></label><label><span>API Key</span><small>{hasKey ? "密钥已保存在服务端；留空会继续使用原密钥" : "只发送到一梦间服务端，不会提供给普通成员"}</small><div className="key-field"><input type="password" value={apiKey} onChange={event => setApiKey(event.target.value)} placeholder={hasKey ? "已保存 · 输入新值可替换" : "sk-••••••••••••••••"} autoComplete="off"/><Icon name="lock" size={16}/></div></label><label><span>模型名称</span><small>填写服务商提供的精确 model id</small><input value={model} onChange={event => setModel(event.target.value)} placeholder="model-name"/></label><div className="api-advanced"><div><span>高级参数</span><small>用于朋友圈与评论生成</small></div><label><span>Temperature</span><input type="number" value={temperature} onChange={event => setTemperature(Number(event.target.value))} min="0" max="2" step="0.05"/></label><label><span>最大输出</span><input type="number" value={maxTokens} onChange={event => setMaxTokens(Number(event.target.value))} min="100" max="8000"/></label></div><footer><p><Icon name="shield" size={15}/>请求由服务端代理，API Key 不会下发到浏览器</p><button className="primary-button" onClick={test} disabled={state === "testing" || !apiBase || !model || (!apiKey && !hasKey)}>{state === "testing" ? <><span className="loader"/>正在连接模型…</> : <><Icon name="plug" size={16}/><span>保存并测试连接</span></>}</button></footer></section>
    <aside className="api-aside"><section className="panel request-map"><p className="eyebrow">ONE REQUEST · MANY ROLES</p><h3>批量生成如何工作</h3><ol><li><span>1</span><p><strong>装配角色上下文</strong><small>角色卡与已触发世界书</small></p></li><li><span>2</span><p><strong>一次发送请求</strong><small>要求返回严格 JSON 数组</small></p></li><li><span>3</span><p><strong>按角色安全分拆</strong><small>每份结果变成独立草稿</small></p></li><li><span>4</span><p><strong>由管理员确认</strong><small>编辑、删掉或发布</small></p></li></ol></section><section className="panel prototype-warning"><Icon name="shield" size={19}/><p><strong>已经接入真实服务端流程</strong><span>配置只对管理员开放。生成与回应会调用这里保存的模型，并先进入草稿，不会擅自发布。</span></p></section></aside>
  </div></div>;
}
