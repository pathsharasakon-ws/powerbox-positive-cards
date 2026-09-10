'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Gift,
  LockKeyhole,
  Pencil,
  Play,
  Plus,
  Save,
  Send,
  Sparkles,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

type Language = 'th' | 'en';
type Screen = 'home' | 'admin' | 'lobby' | 'game' | 'opened';
type Card = {
  id: number;
  th: string;
  en: string;
  imageIndex: number;
  tone: string;
};

const palette = [
  'bg-[#f7c7bc]',
  'bg-[#c7d9f5]',
  'bg-[#f3d9a8]',
  'bg-[#c6e5d5]',
  'bg-[#e3d3ee]',
  'bg-[#f7d6a8]',
];
const defaultCards: Card[] = [
  {
    id: 1,
    imageIndex: 1,
    tone: 'bg-[#fff5d7]',
    th: 'ขอให้ทุกความตั้งใจและความพยายาม ส่งผลลัพธ์ที่ดีกลับมาอย่างที่คุณหวัง เป็นกำลังใจให้อยู่เสมอนะ',
    en: 'May all your dedication and effort bring the good results you hope for. I am always cheering you on.',
  },
  {
    id: 2,
    imageIndex: 2,
    tone: 'bg-[#e7f3e9]',
    th: 'ขอบคุณสำหรับความช่วยเหลือและคำแนะนำดี ๆ ที่คอยแบ่งปันให้กันเสมอนะ',
    en: 'Thank you for always sharing your help and thoughtful advice with us.',
  },
  {
    id: 3,
    imageIndex: 3,
    tone: 'bg-[#fde8e4]',
    th: 'ขอบคุณที่เป็นเพื่อนร่วมคลาสที่ดีและจริงใจ ดีใจมาก ๆ ที่ได้รู้จักคุณนะ',
    en: 'Thank you for being such a kind and genuine classmate. I am so glad to know you.',
  },
  {
    id: 4,
    imageIndex: 4,
    tone: 'bg-[#eee8fa]',
    th: 'อย่าเพิ่งท้อกับบทเรียนที่ยากนะ คุณมาไกลจากจุดเริ่มต้นมากแล้ว เชื่อมั่นในตัวเองเข้าไว้นะ',
    en: 'Do not lose heart over a difficult lesson. You have come so far—keep believing in yourself.',
  },
  {
    id: 5,
    imageIndex: 5,
    tone: 'bg-[#fff0bd]',
    th: 'วันนี้คุณเก่งมากแล้วนะ ขอให้ภูมิใจในทุกก้าวเล็ก ๆ ที่ตัวเองทำได้สำเร็จ',
    en: 'You did wonderfully today. Be proud of every small step you accomplished.',
  },
  {
    id: 6,
    imageIndex: 6,
    tone: 'bg-[#e5f1f5]',
    th: 'อย่ากดดันตัวเองจนเครียดเกินลิมิตนะ ถ้ารู้สึกไม่ไหวก็ถอยออกมาพักก่อนได้เสมอ',
    en: 'Do not pressure yourself beyond your limits. You can always step back and rest when things feel too much.',
  },
  {
    id: 7,
    imageIndex: 7,
    tone: 'bg-[#f9e6ef]',
    th: 'รู้ว่าทุ่มเทและตั้งใจเรียนมาก แต่อย่าลืมทานข้าวให้ตรงเวลาและดื่มน้ำเยอะ ๆ ด้วยนะ',
    en: 'I know how dedicated you are to learning. Please remember to eat on time and drink plenty of water too.',
  },
  {
    id: 8,
    imageIndex: 8,
    tone: 'bg-[#e8edfa]',
    th: 'ดีใจมาก ๆ ที่ได้มาร่วมเรียนคอร์สนี้ด้วยกัน ขอบคุณที่ทำให้บรรยากาศในคลาสอบอุ่นขึ้นเยอะนะ',
    en: 'I am so glad we took this course together. Thank you for making the class feel so much warmer.',
  },
  {
    id: 9,
    imageIndex: 9,
    tone: 'bg-[#e7f3e9]',
    th: 'เห็นเงียบ ๆ ไป ไม่แน่ใจว่าเหนื่อยหรือเปล่า ถ้ามีอะไรให้ช่วยหรืออยากระบาย ทักมาได้ตลอดนะ',
    en: 'You have seemed quiet lately—are you tired? If you need help or want to talk, you can always reach out.',
  },
  {
    id: 10,
    imageIndex: 10,
    tone: 'bg-[#fff0d9]',
    th: 'ถ้าเรียนจบแล้วขอให้บั๊กจงหายไป เงินเดือนก้อนใหญ่จงเข้ามา! รักนะเพื่อนร่วมชะตากรรมหน้าคอมฯ',
    en: 'When this course ends, may every bug disappear and a big salary come your way! Much love, my fellow computer-screen survivor.',
  },
  {
    id: 11,
    imageIndex: 11,
    tone: 'bg-[#f6e5dc]',
    th: 'ไม่อยากให้คอร์สเรียนนี้จบไปเลย ต้องคิดถึงคุณแน่ ๆ',
    en: 'I do not want this course to end—I am definitely going to miss you.',
  },
  {
    id: 12,
    imageIndex: 12,
    tone: 'bg-[#e5eee8]',
    th: 'วันนี้คุณเก่งมากแล้วนะ ขอให้ภูมิใจในทุกก้าวเล็ก ๆ ที่ตัวเองทำได้สำเร็จ',
    en: 'You did wonderfully today. Be proud of every small step you accomplished.',
  },
];

const cardTones = [
  'bg-[#fff5d7]',
  'bg-[#e7f3e9]',
  'bg-[#fde8e4]',
  'bg-[#eee8fa]',
  'bg-[#fff0bd]',
  'bg-[#e5f1f5]',
  'bg-[#f9e6ef]',
  'bg-[#e8edfa]',
];

function cardImageStyle(imageIndex: number) {
  const index = Math.min(12, Math.max(1, imageIndex));
  if (index <= 10)
    return {
      backgroundImage: "url('/card-characters-v4.png')",
      backgroundSize: '500% 200%',
      backgroundPosition: `${((index - 1) % 5) * 25}% ${index <= 5 ? 0 : 100}%`,
    };
  return {
    backgroundImage: "url('/card-characters-extra.png')",
    backgroundSize: '200% 100%',
    backgroundPosition: `${index === 11 ? 0 : 100}% 0%`,
  };
}

const copy = {
  th: {
    subtitle: 'ส่งต่อพลังงานดีๆให้กัน',
    joinRoom: 'เข้าร่วมห้อง',
    roomCode: 'รหัสห้อง',
    yourName: 'ชื่อของคุณ',
    join: 'เข้าห้อง',
    createRoom: 'สร้างห้อง',
    createHelp: 'ตั้งชื่อห้อง แล้วแชร์รหัสให้สมาชิกเข้าร่วม',
    create: 'สร้างห้อง',
    back: 'กลับหน้าแรก',
    roomName: 'ชื่อห้อง',
    participantList: 'แก้ไขรายชื่อผู้เข้าร่วม',
    onePerLine: 'ผู้จัดเท่านั้นที่แก้ไขได้ ใส่หนึ่งชื่อต่อหนึ่งบรรทัด',
    continue: 'สร้างห้อง',
    waiting: 'ห้องพร้อมแล้ว',
    readyHelp: 'แชร์รหัสนี้ให้ผู้เข้าร่วม รายชื่อจะเพิ่มขึ้นเมื่อสมาชิกเข้าห้อง',
    participants: 'ผู้เข้าร่วม',
    start: 'เริ่มเกม',
    activityRoom: 'ห้องกิจกรรม',
    time: 'เหลือเวลา',
    hello: 'สวัสดี,',
    prompt: 'วันนี้อยากส่งพลังงานบวกให้ใคร?',
    progress: 'ส่งแล้ว',
    selectPerson: '1. เลือกผู้รับ',
    recipient: 'ผู้รับที่เลือก',
    selectCard: '2. เลือกการ์ด',
    anonymous: 'ส่งแบบไม่เปิดเผยชื่อ',
    anonymousHelp: 'ผู้รับจะไม่เห็นชื่อของคุณ',
    send: 'ส่งการ์ด',
    sent: 'ส่งพลังบวกแล้ว',
    inbox: 'กล่องพลังใจของฉัน',
    locked: 'กล่องจะเปิดอัตโนมัติเมื่อหมดเวลา',
    testFinal: 'ทดสอบ 15 วินาทีสุดท้าย',
    openTitle: 'กล่องพลังใจเปิดแล้ว',
    openHelp: 'นี่คือข้อความดี ๆ ที่ส่งมาถึงคุณ',
    anonymousFrom: 'ไม่แสดงชื่อ',
    from: 'จาก',
    restart: 'กลับสู่หน้าแรก',
  },
  en: {
    subtitle: 'Share kindness. Spread positive energy.',
    joinRoom: 'Join a room',
    roomCode: 'Room code',
    yourName: 'Your name',
    join: 'Join room',
    createRoom: 'Create room',
    createHelp: 'Name your room, add people, and start the activity',
    create: 'Create room',
    back: 'Back to home',
    roomName: 'Room name',
    participantList: 'Participant list',
    onePerLine: 'One name per line, up to 100 people',
    continue: 'Create room and continue',
    waiting: 'Your room is ready',
    readyHelp: 'Share this code, then start when everyone is ready',
    participants: 'Participants',
    start: 'Start game',
    activityRoom: 'Activity room',
    time: 'Time left',
    hello: 'Hello,',
    prompt: 'Who would you like to uplift today?',
    progress: 'Sent',
    selectPerson: '1. Choose a recipient',
    recipient: 'Selected recipient',
    selectCard: '2. Choose a card',
    anonymous: 'Send anonymously',
    anonymousHelp: 'Your name will be hidden from the recipient',
    send: 'Send card',
    sent: 'Positive energy sent',
    inbox: 'My positivity box',
    locked: 'Your box opens automatically when time is up',
    testFinal: 'Test the final 15 seconds',
    openTitle: 'Your positivity box is open',
    openHelp: 'Here are the kind messages sent your way',
    anonymousFrom: 'Anonymous',
    from: 'From',
    restart: 'Back to home',
  },
};

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length > 1)
    return `${Array.from(words[0])[0] || ''}${Array.from(words[1])[0] || ''}`.toUpperCase();
  return Array.from(words[0] || '')
    .slice(0, 2)
    .join('')
    .toUpperCase()
    .padEnd(2, '•');
}

export default function Home() {
  const [language, setLanguage] = useState<Language>('th');
  const [screen, setScreen] = useState<Screen>('home');
  const [isHost, setIsHost] = useState(false);
  const [roomName, setRoomName] = useState('Bloom Together');
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [nameList, setNameList] = useState('');
  const [people, setPeople] = useState<string[]>([]);
  const [person, setPerson] = useState('');
  const [adminToken, setAdminToken] = useState('');
  const [participantToken, setParticipantToken] = useState('');
  const [roomError, setRoomError] = useState('');
  const [receivedCards, setReceivedCards] = useState<
    Array<{ id: string; cardId: number; senderName: string; anonymous: number }>
  >([]);
  const [cards, setCards] = useState<Card[]>(defaultCards);
  const [selectedCard, setSelectedCard] = useState(1);
  const [remainingCards, setRemainingCards] = useState(
    defaultCards.map((card) => card.id),
  );
  const [showCardManager, setShowCardManager] = useState(false);
  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  const [cardDraft, setCardDraft] = useState<Omit<Card, 'id'>>({
    th: '',
    en: '',
    imageIndex: 1,
    tone: cardTones[0],
  });
  const [anonymous, setAnonymous] = useState(false);
  const [sent, setSent] = useState(0);
  const [sentRecipients, setSentRecipients] = useState<string[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(600);
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [justSent, setJustSent] = useState(false);
  const [systemGiftAdded, setSystemGiftAdded] = useState(false);
  const t = copy[language];
  const activeCard = useMemo(
    () => cards.find((card) => card.id === selectedCard) ?? cards[0],
    [selectedCard, cards],
  );

  useEffect(() => {
    if (screen !== 'game') return;
    const timer = window.setInterval(
      () => setSecondsLeft((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [screen]);

  useEffect(() => {
    if (screen !== 'game' || !/^\d{6}$/.test(roomCode)) return;
    const syncTimer = async () => {
      const response = await fetch(`/api/rooms?code=${roomCode}`);
      if (!response.ok) return;
      const room = await response.json();
      if (typeof room.endsAt === 'number') {
        setSecondsLeft(
          Math.max(0, Math.ceil((room.endsAt - Date.now()) / 1000)),
        );
      }
      if (
        !isHost &&
        Array.isArray(room.participants) &&
        !room.participants.some(
          (item: { name: string }) => item.name === playerName,
        )
      )
        returnRemovedHome();
    };
    void syncTimer();
    const poller = window.setInterval(syncTimer, 2000);
    return () => window.clearInterval(poller);
  }, [screen, roomCode]);

  useEffect(() => {
    if (screen !== 'game') return;
    if (secondsLeft <= 15) setSystemGiftAdded(true);
    if (secondsLeft === 0) setScreen('opened');
  }, [screen, secondsLeft]);

  useEffect(() => {
    if (screen !== 'lobby' || !/^\d{6}$/.test(roomCode)) return;
    const refreshRoom = async () => {
      const response = await fetch(`/api/rooms?code=${roomCode}`);
      if (!response.ok) return;
      const room = await response.json();
      const names = room.participants.map(
        (item: { name: string }) => item.name,
      );
      if (!isHost && !names.includes(playerName)) {
        returnRemovedHome();
        return;
      }
      setRoomName(room.name);
      setDurationMinutes(room.durationMinutes ?? 10);
      if (Array.isArray(room.deck) && room.deck.length) setCards(room.deck);
      setPeople(names);
      if (isHost && document.activeElement?.tagName !== 'TEXTAREA')
        setNameList(names.join('\n'));
      if (!person)
        setPerson(names.find((name: string) => name !== playerName) ?? '');
      if (!isHost && room.status === 'started') {
        resetGame(room.durationMinutes ?? 10, room.endsAt);
        setScreen('game');
      }
    };
    void refreshRoom();
    const poller = window.setInterval(refreshRoom, 2000);
    return () => window.clearInterval(poller);
  }, [screen, roomCode, isHost, person, playerName]);

  useEffect(() => {
    if (screen !== 'opened' || !roomCode || !playerName) return;
    void fetch(
      `/api/cards?code=${roomCode}&recipient=${encodeURIComponent(playerName)}`,
    )
      .then((response) => response.json())
      .then((data) => setReceivedCards(data.cards ?? []));
  }, [screen, roomCode, playerName]);

  const timeDisplay = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;
  const participantNames = people;
  const availablePeople = participantNames.filter(
    (name) => name !== playerName && !sentRecipients.includes(name),
  );

  function resetGame(minutes = durationMinutes, endsAt?: number | null) {
    setRemainingCards(cards.map((card) => card.id));
    setSelectedCard(cards[0]?.id ?? 1);
    setSent(0);
    setSentRecipients([]);
    setSecondsLeft(
      typeof endsAt === 'number'
        ? Math.max(0, Math.ceil((endsAt - Date.now()) / 1000))
        : minutes * 60,
    );
    setSystemGiftAdded(false);
  }

  async function persistDeck(nextDeck: Card[]) {
    const response = await fetch('/api/rooms', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        action: 'update_deck',
        code: roomCode,
        adminToken,
        deck: nextDeck,
      }),
    });
    if (!response.ok) return false;
    const room = await response.json();
    setCards(room.deck ?? nextDeck);
    return true;
  }

  function beginAddCard() {
    setEditingCardId(null);
    setCardDraft({
      th: '',
      en: '',
      imageIndex: (cards.length % 12) + 1,
      tone: cardTones[cards.length % cardTones.length],
    });
    setShowCardManager(true);
  }

  function beginEditCard(card: Card) {
    setEditingCardId(card.id);
    setCardDraft({
      th: card.th,
      en: card.en,
      imageIndex: card.imageIndex,
      tone: card.tone,
    });
    setShowCardManager(true);
  }

  async function saveCardDraft() {
    if (!cardDraft.th.trim() || !cardDraft.en.trim()) return;
    const nextId =
      editingCardId ?? Math.max(0, ...cards.map((card) => card.id)) + 1;
    const nextCard = {
      id: nextId,
      ...cardDraft,
      th: cardDraft.th.trim(),
      en: cardDraft.en.trim(),
    };
    const nextDeck =
      editingCardId === null
        ? [...cards, nextCard]
        : cards.map((card) => (card.id === editingCardId ? nextCard : card));
    if (await persistDeck(nextDeck)) {
      setEditingCardId(null);
      setCardDraft({ th: '', en: '', imageIndex: 1, tone: cardTones[0] });
    }
  }

  async function deleteCard(cardId: number) {
    if (cards.length <= 1) return;
    if (
      !window.confirm(
        language === 'th' ? 'ลบการ์ดใบนี้ใช่ไหม?' : 'Delete this card?',
      )
    )
      return;
    await persistDeck(cards.filter((card) => card.id !== cardId));
  }

  function returnRemovedHome() {
    setRoomCode('');
    setPeople([]);
    setPerson('');
    setParticipantToken('');
    setIsHost(false);
    setScreen('home');
    setRoomError(
      language === 'th'
        ? 'คุณถูกนำออกจากห้องแล้ว'
        : 'You have been removed from the room.',
    );
  }

  async function removeParticipant(name: string) {
    if (name === playerName) return;
    if (
      !window.confirm(
        language === 'th'
          ? `นำ ${name} ออกจากห้องใช่ไหม?`
          : `Remove ${name} from the room?`,
      )
    )
      return;
    const response = await fetch('/api/rooms', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        action: 'remove_participant',
        code: roomCode,
        adminToken,
        name,
      }),
    });
    if (!response.ok) return;
    const room = await response.json();
    setPeople(room.participants.map((item: { name: string }) => item.name));
  }

  async function goHome() {
    if (
      roomCode &&
      playerName &&
      (participantToken || adminToken) &&
      screen !== 'admin'
    ) {
      try {
        await fetch('/api/rooms', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            action: 'leave',
            code: roomCode,
            name: playerName,
            participantToken,
            adminToken: isHost ? adminToken : '',
          }),
        });
      } catch {
        // Navigation should still work when the connection drops.
      }
    }
    setRoomCode('');
    setRoomError('');
    setPeople([]);
    setPerson('');
    setAdminToken('');
    setParticipantToken('');
    setIsHost(false);
    setScreen('home');
  }

  async function joinRoom() {
    if (!/^\d{6}$/.test(roomCode) || !playerName.trim()) return;
    setRoomError('');
    const response = await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        action: 'join',
        code: roomCode,
        name: playerName,
      }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      setRoomError(
        error.error === 'duplicate_name'
          ? language === 'th'
            ? 'ชื่อนี้มีผู้ใช้ในห้องแล้ว กรุณาใช้ชื่ออื่น'
            : 'This name is already in use. Please choose another.'
          : language === 'th'
            ? 'ไม่พบห้อง หรือห้องเริ่มไปแล้ว'
            : 'Room not found or already started',
      );
      return;
    }
    const room = await response.json();
    const joinedName =
      room.participantName ?? playerName.trim().replace(/\s+/g, ' ');
    setPlayerName(joinedName);
    setRoomName(room.name);
    if (Array.isArray(room.deck) && room.deck.length) setCards(room.deck);
    setPeople(room.participants.map((item: { name: string }) => item.name));
    setPerson(
      room.participants.find(
        (item: { name: string }) => item.name !== joinedName,
      )?.name ?? '',
    );
    setParticipantToken(room.participantToken ?? '');
    setIsHost(false);
    resetGame();
    setScreen(room.status === 'started' ? 'game' : 'lobby');
  }

  async function prepareRoom() {
    const nextRoomName = roomName.trim() || 'Bloom Together';
    const response = await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        action: 'create',
        name: nextRoomName,
        adminName: playerName,
        durationMinutes,
      }),
    });
    const room = await response.json();
    const names = room.participants.map((item: { name: string }) => item.name);
    setPlayerName(
      room.participantName ?? playerName.trim().replace(/\s+/g, ' '),
    );
    setRoomName(room.name);
    setRoomCode(room.code);
    setAdminToken(room.adminToken);
    setParticipantToken(room.participantToken ?? '');
    setPeople(names);
    setNameList(names.join('\n'));
    setIsHost(true);
    setScreen('lobby');
  }

  async function startGame() {
    const response = await fetch('/api/rooms', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'start', code: roomCode, adminToken }),
    });
    if (!response.ok) return;
    const room = await response.json();
    resetGame(durationMinutes, room.endsAt);
    setScreen('game');
  }

  async function testFinalSeconds() {
    const response = await fetch('/api/rooms', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        action: 'test_final',
        code: roomCode,
        adminToken,
      }),
    });
    if (!response.ok) return;
    const room = await response.json();
    if (typeof room.endsAt === 'number') {
      setSecondsLeft(Math.max(0, Math.ceil((room.endsAt - Date.now()) / 1000)));
    }
  }

  async function editParticipant(oldName: string) {
    const nextName = window
      .prompt(
        language === 'th' ? 'แก้ไขชื่อผู้เข้าร่วม' : 'Edit participant name',
        oldName,
      )
      ?.trim();
    if (!nextName || nextName === oldName) return;
    const names = participantNames.map((name) =>
      name === oldName ? nextName : name,
    );
    setNameList(names.join('\n'));
    if (oldName === playerName) setPlayerName(nextName);
    const response = await fetch('/api/rooms', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        action: 'update_participants',
        code: roomCode,
        adminToken,
        participants: names,
      }),
    });
    if (response.ok) setPeople(names);
  }

  async function sendCard() {
    if (sent >= cards.length || !activeCard || !person) return;
    const response = await fetch('/api/cards', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        code: roomCode,
        cardId: activeCard.id,
        recipientName: person,
        senderName: playerName,
        anonymous,
      }),
    });
    if (!response.ok) return;
    const nextCards = remainingCards.filter((id) => id !== selectedCard);
    setRemainingCards(nextCards);
    setSent((value) => value + 1);
    setSentRecipients((value) => [...value, person]);
    const nextPerson = participantNames.find(
      (name) => name !== person && !sentRecipients.includes(name),
    );
    if (nextPerson) setPerson(nextPerson);
    if (nextCards.length) setSelectedCard(nextCards[0]);
    setJustSent(true);
    window.setTimeout(() => setJustSent(false), 1500);
  }

  const Header = () => (
    <header className="border-b-2 border-dashed border-[#6b4d3a]/30 bg-[#fff9ed]/90 backdrop-blur">
      <div
        className={`mx-auto flex max-w-6xl items-center px-4 py-3 sm:px-8 ${screen === 'home' ? 'justify-end' : 'justify-between'}`}
      >
        {screen !== 'home' && (
          <button
            onClick={() => void goHome()}
            className="flex items-center gap-2 rounded-full border-2 border-[#5d4638] bg-white px-4 py-2 text-xs font-bold shadow-[2px_3px_0_#5d4638] transition hover:-translate-y-0.5"
          >
            <ArrowLeft className="size-4" /> {t.back}
          </button>
        )}
        <div className="flex items-center gap-2">
          <button
            className="rounded-full border-2 border-[#5d4638] bg-[#ffe19a] px-4 py-2 text-xs font-bold shadow-[2px_3px_0_#5d4638] transition hover:-translate-y-0.5"
            onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
            aria-label="Switch language"
          >
            {language === 'th' ? 'English' : 'ไทย'}
          </button>
        </div>
      </div>
    </header>
  );

  if (screen === 'home')
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Header />
        <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:py-12">
          <div className="relative min-h-[420px] overflow-hidden rounded-[32px_24px_36px_22px] border-2 border-[#5d4638] bg-[#fff6df] shadow-[6px_7px_0_#efb9aa]">
            <img
              src="/powerbox-friends.png"
              alt="Friends exchanging a positive card"
              className="absolute inset-0 h-full w-full object-cover object-[58%_center]"
            />
            <div className="hero-home-overlay absolute inset-0" />
            <div className="relative z-10 flex max-w-md flex-col p-7 sm:p-10">
              <h1 className="font-heading text-4xl font-bold leading-tight tracking-[-.05em] sm:text-5xl">
                {t.subtitle}
              </h1>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-4">
            <div className="rounded-[28px_22px_30px_20px] border-2 border-[#5d4638] bg-white p-6 shadow-[5px_6px_0_#f1c86f]">
              <h2 className="text-xl font-bold">{t.joinRoom}</h2>
              <div className="mt-5 space-y-4">
                <label className="block text-sm font-bold">
                  {t.roomCode}
                  <Input
                    value={roomCode}
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    onChange={(event) =>
                      setRoomCode(
                        event.target.value.replace(/\D/g, '').slice(0, 6),
                      )
                    }
                    className="mt-2 h-12 rounded-xl border-2 bg-[#fffaf0] text-base font-bold tracking-[.18em]"
                  />
                </label>
                <label className="block text-sm font-bold">
                  {t.yourName}
                  <Input
                    value={playerName}
                    onChange={(event) => setPlayerName(event.target.value)}
                    className="mt-2 h-12 rounded-xl border-2 bg-[#fffaf0] text-base"
                  />
                </label>
              </div>
              {roomError && (
                <p className="mt-3 text-sm font-bold text-destructive">
                  {roomError}
                </p>
              )}
              <Button
                onClick={joinRoom}
                className="mt-5 h-12 w-full rounded-xl border-2 border-[#5d4638] text-base font-bold shadow-[3px_4px_0_#5d4638]"
              >
                <Play /> {t.join}
              </Button>
            </div>
            <button
              onClick={() => setScreen('admin')}
              className="flex w-full items-center justify-between rounded-[22px_18px_24px_17px] border-2 border-[#5d4638] bg-[#d9eee3] p-5 text-left shadow-[3px_4px_0_#5d4638] transition hover:-translate-y-0.5"
            >
              <span>
                <strong className="block text-sm">{t.createRoom}</strong>
                <span className="mt-1 block text-xs text-[#5f746a]">
                  {t.createHelp}
                </span>
              </span>
              <Plus className="size-5" />
            </button>
          </div>
        </section>
      </main>
    );

  if (screen === 'admin')
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Header />
        <section className="mx-auto max-w-3xl px-4 py-8 sm:px-8 sm:py-12">
          <div className="rounded-[30px_24px_32px_22px] border-2 border-[#5d4638] bg-white p-6 shadow-[6px_7px_0_#f1c86f] sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full border-2 border-[#5d4638] bg-[#d9eee3]">
                <Users className="size-5" />
              </span>
              <h1 className="text-2xl font-bold">{t.createRoom}</h1>
            </div>
            <div className="mt-7 space-y-6">
              <label className="block text-sm font-bold">
                {t.roomName}
                <Input
                  value={roomName}
                  onChange={(event) => setRoomName(event.target.value)}
                  className="mt-2 h-12 rounded-xl border-2 bg-[#fffaf0] text-base"
                />
              </label>
              <label className="block text-sm font-bold">
                {t.yourName}
                <Input
                  value={playerName}
                  onChange={(event) => setPlayerName(event.target.value)}
                  className="mt-2 h-12 rounded-xl border-2 bg-[#fffaf0] text-base"
                />
              </label>
              <label className="block text-sm font-bold">
                {language === 'th' ? 'เวลาเล่น' : 'Game duration'}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  {durationMinutes} {language === 'th' ? 'นาที' : 'minutes'}
                </span>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={durationMinutes}
                  onChange={(event) =>
                    setDurationMinutes(Number(event.target.value))
                  }
                  className="mt-3 block w-full accent-[#ef6f52]"
                />
              </label>
            </div>
            <Button
              onClick={prepareRoom}
              className="mt-6 h-12 w-full rounded-xl border-2 border-[#5d4638] text-base font-bold shadow-[3px_4px_0_#5d4638]"
            >
              <Check /> {t.continue}
            </Button>
          </div>
        </section>
      </main>
    );

  if (screen === 'lobby')
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Header />
        <section className="mx-auto max-w-3xl px-4 py-8 text-center sm:px-8 sm:py-12">
          <div className="rounded-[30px_24px_32px_22px] border-2 border-[#5d4638] bg-white p-7 shadow-[6px_7px_0_#efb9aa] sm:p-10">
            <Sparkles className="mx-auto size-9 text-primary" />
            <h1 className="mt-4 text-3xl font-bold">{roomName}</h1>
            <p className="mt-2 text-lg font-bold">{t.waiting}</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {t.readyHelp}
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(roomCode)}
              className="mx-auto mt-7 flex items-center gap-3 rounded-2xl border-2 border-dashed border-[#5d4638] bg-[#fff5d7] px-6 py-4 text-3xl font-bold tracking-[.08em]"
            >
              <span>{roomCode}</span>
              <Copy className="size-5" />
            </button>
          <div className="mx-auto mt-7 max-w-lg rounded-2xl bg-[#f5eee5] p-5 text-left">
              <div className="flex justify-between text-sm font-bold">
                <span>{t.participants}</span>
                <span>{participantNames.length} / 100</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {participantNames.map((name, index) =>
                  isHost ? (
                    <span
                      key={`${name}-${index}`}
                      className="inline-flex items-center overflow-hidden rounded-full border border-[#5d4638]/25 bg-white text-xs font-bold"
                    >
                      <button
                        onClick={() => editParticipant(name)}
                        className="px-3 py-1.5 transition hover:bg-[#fff5d7]"
                        title={
                          language === 'th'
                            ? 'คลิกเพื่อแก้ชื่อ'
                            : 'Click to edit name'
                        }
                      >
                        {name}
                      </button>
                      {name !== playerName && (
                        <button
                          onClick={() => removeParticipant(name)}
                          className="border-l border-[#5d4638]/20 px-2 py-1.5 text-destructive transition hover:bg-[#fde8e4]"
                          aria-label={
                            language === 'th' ? `ลบ ${name}` : `Remove ${name}`
                          }
                          title={
                            language === 'th'
                              ? 'นำออกจากห้อง'
                              : 'Remove from room'
                          }
                        >
                          <X className="size-3" />
                        </button>
                      )}
                    </span>
                  ) : (
                    <span
                      key={`${name}-${index}`}
                      className="rounded-full border border-[#5d4638]/25 bg-white px-3 py-1 text-xs font-medium"
                    >
                      {name}
                    </span>
                  ),
                )}
              </div>
              {participantNames.length === 0 && (
                <p className="mt-4 text-sm text-muted-foreground">
                  {language === 'th'
                    ? 'กำลังรอสมาชิกเข้าร่วม…'
                    : 'Waiting for people to join…'}
                </p>
              )}
            </div>
            {isHost && (
              <section className="mx-auto mt-6 max-w-2xl rounded-[24px_20px_26px_18px] border-2 border-[#5d4638] bg-[#fffaf0] p-5 text-left shadow-[3px_4px_0_#f1c86f]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bold">
                      {language === 'th' ? 'จัดการการ์ด' : 'Manage cards'}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {cards.length}{' '}
                      {language === 'th'
                        ? 'ใบ · เฉพาะ Admin เท่านั้น'
                        : 'cards · Admin only'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowCardManager((value) => !value)}
                      className="h-9 rounded-xl border-2 px-3 text-xs font-bold"
                    >
                      {showCardManager ? <X /> : <Pencil />}
                      {showCardManager
                        ? language === 'th'
                          ? 'ปิด'
                          : 'Close'
                        : language === 'th'
                          ? 'เปิดจัดการ'
                          : 'Open manager'}
                    </Button>
                    {cards.length < 24 && (
                      <Button
                        onClick={beginAddCard}
                        className="h-9 rounded-xl border-2 border-[#5d4638] px-3 text-xs font-bold"
                      >
                        <Plus />
                        {language === 'th' ? 'เพิ่มการ์ด' : 'Add card'}
                      </Button>
                    )}
                  </div>
                </div>
                {showCardManager && (
                  <div className="mt-5 space-y-5">
                    <div className="grid max-h-72 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                      {cards.map((card) => (
                        <article
                          key={card.id}
                          className={`positive-card relative overflow-hidden rounded-2xl border-2 border-[#5d4638]/40 p-3 ${card.tone}`}
                        >
                          <div className="relative z-10 flex gap-3">
                            <div
                              className="size-16 shrink-0 bg-no-repeat"
                              style={cardImageStyle(card.imageIndex)}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-2 text-xs font-bold">
                                {card.th}
                              </p>
                              <p className="mt-1 line-clamp-1 text-[10px] text-muted-foreground">
                                {card.en}
                              </p>
                              <div className="mt-2 flex gap-1">
                                <button
                                  onClick={() => beginEditCard(card)}
                                  className="rounded-lg border bg-white px-2 py-1 text-[10px] font-bold"
                                >
                                  <Pencil className="mr-1 inline size-3" />
                                  {language === 'th' ? 'แก้ไข' : 'Edit'}
                                </button>
                                <button
                                  onClick={() => deleteCard(card.id)}
                                  disabled={cards.length <= 1}
                                  className="rounded-lg border bg-white px-2 py-1 text-[10px] font-bold text-destructive disabled:opacity-40"
                                >
                                  <Trash2 className="mr-1 inline size-3" />
                                  {language === 'th' ? 'ลบ' : 'Delete'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                    <div className="rounded-2xl border-2 border-dashed border-[#5d4638]/35 bg-white p-4">
                      <h3 className="text-sm font-bold">
                        {editingCardId === null
                          ? language === 'th'
                            ? 'สร้างการ์ดใหม่'
                            : 'Create a card'
                          : language === 'th'
                            ? 'แก้ไขการ์ด'
                            : 'Edit card'}
                      </h3>
                      <div className="mt-3 grid gap-3">
                        <label className="text-xs font-bold">
                          {language === 'th' ? 'ข้อความภาษาไทย' : 'Thai message'}
                          <Textarea
                            value={cardDraft.th}
                            maxLength={400}
                            onChange={(event) =>
                              setCardDraft({
                                ...cardDraft,
                                th: event.target.value,
                              })
                            }
                            className="mt-1 min-h-20 rounded-xl bg-[#fffaf0]"
                          />
                        </label>
                        <label className="text-xs font-bold">
                          {language === 'th'
                            ? 'ข้อความภาษาอังกฤษ'
                            : 'English message'}
                          <Textarea
                            value={cardDraft.en}
                            maxLength={400}
                            onChange={(event) =>
                              setCardDraft({
                                ...cardDraft,
                                en: event.target.value,
                              })
                            }
                            className="mt-1 min-h-20 rounded-xl bg-[#fffaf0]"
                          />
                        </label>
                      </div>
                      <div className="mt-4">
                        <p className="text-xs font-bold">
                          {language === 'th'
                            ? 'เลือกรูปบนการ์ด'
                            : 'Choose card image'}
                        </p>
                        <div className="mt-2 grid grid-cols-6 gap-2 sm:grid-cols-12">
                          {Array.from(
                            { length: 12 },
                            (_, index) => index + 1,
                          ).map((imageIndex) => (
                            <button
                              key={imageIndex}
                              onClick={() =>
                                setCardDraft({ ...cardDraft, imageIndex })
                              }
                              aria-pressed={cardDraft.imageIndex === imageIndex}
                              className={`aspect-square rounded-xl border-2 bg-[#fffaf0] bg-no-repeat p-1 ${cardDraft.imageIndex === imageIndex ? 'border-primary shadow-[2px_2px_0_#5d4638]' : 'border-[#5d4638]/20'}`}
                              style={cardImageStyle(imageIndex)}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-xs font-bold">
                          {language === 'th'
                            ? 'เลือกสีการ์ด'
                            : 'Choose card color'}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {cardTones.map((tone) => (
                            <button
                              key={tone}
                              onClick={() =>
                                setCardDraft({ ...cardDraft, tone })
                              }
                              aria-pressed={cardDraft.tone === tone}
                              className={`size-8 rounded-full border-2 ${tone} ${cardDraft.tone === tone ? 'border-primary shadow-[2px_2px_0_#5d4638]' : 'border-[#5d4638]/25'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={beginAddCard}
                          className="h-10 rounded-xl border-2 text-xs font-bold"
                        >
                          <X />
                          {language === 'th' ? 'ล้างข้อมูล' : 'Clear'}
                        </Button>
                        <Button
                          onClick={saveCardDraft}
                          disabled={
                            !cardDraft.th.trim() || !cardDraft.en.trim()
                          }
                          className="h-10 rounded-xl border-2 border-[#5d4638] text-xs font-bold"
                        >
                          <Save />
                          {language === 'th' ? 'บันทึกการ์ด' : 'Save card'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}
            {isHost ? (
              <Button
                onClick={startGame}
                disabled={participantNames.length < 2}
                className="mt-7 h-12 rounded-xl border-2 border-[#5d4638] px-7 text-base font-bold shadow-[3px_4px_0_#5d4638]"
              >
                <Play /> {t.start}
              </Button>
            ) : (
              <p className="mt-7 text-sm font-bold text-[#467d68]">
                {language === 'th'
                  ? 'รอผู้จัดเริ่มกิจกรรม'
                  : 'Waiting for the host to start'}
              </p>
            )}
          </div>
        </section>
      </main>
    );

  if (screen === 'opened') {
    const received = receivedCards.map((entry) => ({
      ...entry,
      card: cards.find((card) => card.id === entry.cardId) ?? cards[0],
    }));
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Header />
        <section className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
          <div className="text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full border-2 border-[#5d4638] bg-[#ffe19a] shadow-[4px_5px_0_#5d4638]">
              <Gift className="size-7" />
            </span>
            <h1 className="mt-5 text-3xl font-bold sm:text-4xl">
              {t.openTitle}
            </h1>
            <p className="mt-2 text-muted-foreground">{t.openHelp}</p>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {received.map((entry) => (
              <article
                key={entry.id}
                className={`positive-card relative overflow-hidden ${entry.card.tone} rounded-[26px_20px_29px_18px] border-2 border-[#5d4638] p-7 shadow-[4px_5px_0_#decdb7]`}
              >
                <p className="relative z-10 text-base font-bold leading-relaxed">
                  {entry.card.th}
                </p>
                <p className="relative z-10 mt-2 text-sm leading-relaxed text-[#6d5a4d]">
                  {entry.card.en}
                </p>
                <p className="relative z-10 mt-5 border-t border-[#5d4638]/20 pt-3 text-xs font-bold text-muted-foreground">
                  {entry.anonymous
                    ? `${t.from} ${t.anonymousFrom}`
                    : `${t.from} ${entry.senderName}`}
                </p>
              </article>
            ))}
            {received.length === 0 && systemGiftAdded && (
              <article className="positive-card relative overflow-hidden rounded-[26px_20px_29px_18px] border-2 border-[#5d4638] bg-[#d9eee3] p-7 shadow-[4px_5px_0_#88bda7]">
                <Sparkles className="relative z-10 size-5 text-primary" />
                <p className="relative z-10 mt-4 text-base font-bold leading-relaxed">
                  คุณมีคุณค่า และการมีคุณอยู่ตรงนี้มีความหมายเสมอ
                </p>
                <p className="relative z-10 mt-2 text-sm leading-relaxed text-[#536c61]">
                  You matter, and your presence makes a difference.
                </p>
                <p className="relative z-10 mt-5 border-t border-[#5d4638]/20 pt-3 text-xs font-bold text-muted-foreground">
                  {t.from} {t.anonymousFrom}
                </p>
              </article>
            )}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <section className="mx-auto max-w-[1500px] px-4 pb-28 pt-6 sm:px-8 sm:py-9">
        <div className="mb-6 flex flex-col gap-4 rounded-[24px_20px_26px_18px] border-2 border-[#5d4638] bg-[#fff6df] p-5 shadow-[4px_5px_0_#efb9aa] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 text-xs font-bold uppercase tracking-[.14em] text-[#467d68]">
              {roomName} · {t.activityRoom} · {roomCode}
            </div>
            <h1 className="text-2xl font-bold">
              {t.hello} {playerName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{t.prompt}</p>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border-2 border-[#5d4638] bg-white px-5 py-3 shadow-[3px_4px_0_#5d4638]">
            <Clock3 className="size-5 text-primary" />
            <div>
              <span className="block text-xs font-medium text-muted-foreground">
                {t.time}
              </span>
              <strong className="text-2xl tabular-nums text-primary">
                {timeDisplay}
              </strong>
            </div>
          </div>
        </div>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[30px_24px_28px_22px] border-2 border-[#5d4638] bg-white p-5 shadow-[5px_6px_0_#f1c86f] sm:p-7">
            <div className="mb-7 flex items-center gap-4">
              <Progress
                value={(sent / cards.length) * 100}
                className="flex-1 [&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-track]]:bg-[#f3e9dc] [&_[data-slot=progress-indicator]]:bg-primary"
              />
              <span className="min-w-24 text-right text-sm font-bold">
                {t.progress} {sent}/{cards.length}
              </span>
            </div>
            <section>
              <h2 className="mb-3 text-sm font-bold">{t.selectPerson}</h2>
              <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-5 xl:grid-cols-10">
                {availablePeople.map((name, index) => (
                  <button
                    key={name}
                    onClick={() =>
                      setPerson((current) => (current === name ? '' : name))
                    }
                    aria-pressed={person === name}
                    className={`relative flex min-w-0 flex-col items-center gap-2 rounded-[18px_14px_20px_13px] border-2 px-2 py-3 text-center transition ${person === name ? 'border-[#5d4638] bg-[#fff3dd] shadow-[3px_3px_0_#efb9aa]' : 'border-[#5d4638]/20 bg-[#fffdf8] hover:border-[#5d4638]/50 hover:bg-muted'}`}
                  >
                    <span
                      className={`grid size-11 shrink-0 place-items-center rounded-full border-2 border-[#5d4638] ${palette[index % palette.length]} text-xs font-bold tracking-wide`}
                    >
                      {initials(name)}
                    </span>
                    <span className="w-full break-words text-[11px] font-bold leading-tight">
                      {name}
                    </span>
                    {person === name && (
                      <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-[#467d68] text-white">
                        <Check className="size-3" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </section>
            <section className="mt-6">
              <h2 className="mb-3 text-sm font-bold">{t.selectCard}</h2>
              <div className="grid max-h-[540px] gap-3 overflow-y-auto pr-1 sm:grid-cols-3 xl:grid-cols-4">
                {cards
                  .filter((card) => remainingCards.includes(card.id))
                  .map((card) => (
                    <button
                      key={card.id}
                      onClick={() => setSelectedCard(card.id)}
                      className={`positive-card relative min-h-80 overflow-hidden rounded-[24px_19px_27px_18px] border-2 border-[#5d4638] p-3 text-left transition hover:-translate-y-1 ${card.tone} ${selectedCard === card.id ? 'rotate-[-1deg] shadow-[4px_5px_0_#e96b50]' : 'shadow-[2px_3px_0_#decdb7]'}`}
                    >
                      {selectedCard === card.id && (
                        <span className="absolute right-3 top-3 z-20 grid size-7 place-items-center rounded-full border-2 border-[#5d4638] bg-primary text-white">
                          <Check className="size-3" />
                        </span>
                      )}
                      <div
                        role="img"
                        aria-label={`${card.th} / ${card.en}`}
                        className="relative z-10 mx-auto aspect-square w-full max-w-40 bg-no-repeat"
                        style={cardImageStyle(card.imageIndex)}
                      />
                      <div className="relative z-10 mx-1 rounded-xl border border-[#5d4638]/15 bg-[#fffdf8]/80 px-3 pb-3 pt-4 backdrop-blur-[1px]">
                        <p className="text-sm font-bold leading-relaxed">
                          {card.th}
                        </p>
                        <p className="mt-2 border-t border-[#5d4638]/15 pt-2 text-xs font-medium leading-relaxed text-[#6d5a4d]">
                          {card.en}
                        </p>
                      </div>
                    </button>
                  ))}
              </div>
            </section>
            <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t-2 border-[#5d4638] bg-[#fff9ed] p-4 shadow-[0_-4px_18px_rgba(93,70,56,.16)] sm:static sm:mt-6 sm:flex-row sm:justify-between sm:border-t sm:border-[#efe6db] sm:bg-transparent sm:p-0 sm:pt-5 sm:shadow-none">
              <label className="flex cursor-pointer items-center gap-3">
                <Switch checked={anonymous} onCheckedChange={setAnonymous} />
                <span>
                  <span className="block text-sm font-bold">{t.anonymous}</span>
                  <span className="block text-xs text-muted-foreground">
                    {t.anonymousHelp}
                  </span>
                </span>
              </label>
              <Button
                onClick={sendCard}
                disabled={
                  sent >= cards.length ||
                  availablePeople.length === 0 ||
                  !person
                }
                className="h-12 flex-1 rounded-xl border-2 border-[#5d4638] px-7 text-sm font-bold shadow-[4px_5px_0_#5d4638] sm:flex-none"
              >
                {justSent ? <Check /> : <Send />} {justSent ? t.sent : t.send}
              </Button>
            </div>
          </div>
          <aside className="rounded-[26px_32px_24px_29px] border-2 border-[#5d4638] bg-[#88bda7] p-6 text-[#35291f] shadow-[5px_6px_0_#5d4638]">
            <div className="flex items-start justify-between">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-[#315f4e]">
                {t.inbox}
              </p>
              <Gift className="size-6 text-[#744b2c]" />
            </div>
            <div className="relative mx-auto my-10 h-44 max-w-56">
              <div className="absolute left-1/2 top-0 h-32 w-40 -translate-x-1/2 rotate-[-5deg] rounded-2xl border-2 border-[#5d4638] bg-[#f7c7bc] shadow-[3px_4px_0_#5d4638]" />
              <div className="absolute left-1/2 top-3 h-32 w-40 -translate-x-1/2 rotate-[6deg] rounded-2xl border-2 border-[#5d4638] bg-[#f5d797] shadow-[3px_4px_0_#5d4638]" />
              <div className="absolute bottom-0 left-1/2 grid h-28 w-52 -translate-x-1/2 place-items-center rounded-2xl border-2 border-[#5d4638] bg-primary text-white shadow-[4px_5px_0_#5d4638]">
                <LockKeyhole className="size-7" />
              </div>
            </div>
            <div className="rounded-2xl border-2 border-[#5d4638] bg-[#fff9ed] p-4 text-center shadow-[3px_3px_0_#5d4638]">
              <p className="text-sm font-bold">{t.locked}</p>
              <p className="mt-1 text-xs font-bold text-[#467d68]">
                {timeDisplay}
              </p>
            </div>
            {isHost && (
              <Button
                variant="outline"
                onClick={testFinalSeconds}
                className="mt-4 h-10 w-full rounded-xl border-2 bg-white/70 text-xs font-bold"
              >
                <Clock3 /> {t.testFinal}
              </Button>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
