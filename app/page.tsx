'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, Clock3, Gift, Heart, LockKeyhole, Send, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';

type Language = 'th' | 'en';
const people = [
  { name: 'Mali', initials: 'มล', color: 'bg-[#f7c7bc]' },
  { name: 'Niran', initials: 'นร', color: 'bg-[#c7d9f5]' },
  { name: 'Ploy', initials: 'พล', color: 'bg-[#f3d9a8]' },
  { name: 'Ton', initials: 'ตน', color: 'bg-[#c6e5d5]' },
];
const cards = [
  { id: 1, emoji: '🌤️', tone: 'bg-[#fff5d7]', th: 'คุณทำให้บรรยากาศรอบตัวสดใสขึ้นเสมอ', en: 'You always make the room feel a little brighter.' },
  { id: 2, emoji: '🌱', tone: 'bg-[#e7f3e9]', th: 'ฉันชื่นชมความตั้งใจและการเติบโตของคุณ', en: 'I admire your dedication and the way you keep growing.' },
  { id: 3, emoji: '💛', tone: 'bg-[#fde8e4]', th: 'ขอบคุณที่เป็นพื้นที่สบายใจให้คนรอบข้าง', en: 'Thank you for making people around you feel at ease.' },
  { id: 4, emoji: '✨', tone: 'bg-[#eee8fa]', th: 'ความเป็นตัวคุณสร้างความแตกต่างที่งดงาม', en: 'Being yourself makes a beautiful difference.' },
  { id: 5, emoji: '🌻', tone: 'bg-[#fff0bd]', th: 'พลังและรอยยิ้มของคุณส่งต่อถึงคนอื่นเสมอ', en: 'Your energy and smile always reach the people around you.' },
  { id: 6, emoji: '🫶', tone: 'bg-[#e5f1f5]', th: 'คุณเก่งกว่าที่ตัวเองคิด และฉันเชื่อในตัวคุณ', en: 'You are more capable than you know, and I believe in you.' },
  { id: 7, emoji: '🌈', tone: 'bg-[#f9e6ef]', th: 'ขอบคุณที่นำมุมมองดี ๆ มาแบ่งปันกับพวกเรา', en: 'Thank you for sharing your thoughtful perspective with us.' },
  { id: 8, emoji: '⭐', tone: 'bg-[#e8edfa]', th: 'ความพยายามของคุณมีคนมองเห็นและชื่นชม', en: 'Your effort is seen and deeply appreciated.' },
  { id: 9, emoji: '🍀', tone: 'bg-[#e7f3e9]', th: 'ขอให้ความใจดีที่คุณมอบให้ย้อนกลับไปหาคุณ', en: 'May the kindness you give find its way back to you.' },
  { id: 10, emoji: '☀️', tone: 'bg-[#fff0d9]', th: 'โลกใบนี้ดีขึ้นเพราะมีคุณอยู่ตรงนี้', en: 'The world is better because you are here.' },
];
const copy = {
  th: { subtitle: 'ส่งต่อคำดี ๆ ให้กัน', room: 'ห้องกิจกรรม', participants: 'เข้าร่วมแล้ว 47 / 100 คน', time: 'เหลือเวลา', hello: 'สวัสดี, ปัท 👋', prompt: 'วันนี้อยากส่งพลังบวกให้ใคร?', progress: 'ส่งแล้ว', selectPerson: '1. เลือกผู้รับ', recipient: 'ผู้รับที่เลือก', selectCard: '2. เลือกการ์ด', anonymous: 'ส่งแบบไม่เปิดเผยชื่อ', anonymousHelp: 'ผู้รับจะไม่เห็นชื่อของคุณ', send: 'ส่งการ์ด', sent: 'ส่งพลังบวกแล้ว!', inbox: 'กล่องพลังใจของฉัน', inboxCount: 'ได้รับแล้ว 4 ใบ', locked: 'กล่องจะเปิดเมื่อหมดเวลา', appGift: 'มีการ์ดพิเศษจาก PowerBox รอคุณอยู่' },
  en: { subtitle: 'Share kindness. Spread positive energy.', room: 'Activity room', participants: '47 / 100 joined', time: 'Time left', hello: 'Hello, Pat 👋', prompt: 'Who would you like to uplift today?', progress: 'Sent', selectPerson: '1. Choose a recipient', recipient: 'Selected recipient', selectCard: '2. Choose a card', anonymous: 'Send anonymously', anonymousHelp: 'Your name will be hidden from the recipient', send: 'Send card', sent: 'Positive energy sent!', inbox: 'My positivity box', inboxCount: '4 cards received', locked: 'Your box unlocks when time is up', appGift: 'A special card from PowerBox is waiting for you' },
};

export default function Home() {
  const [language, setLanguage] = useState<Language>('th');
  const [person, setPerson] = useState(people[0]);
  const [selectedCard, setSelectedCard] = useState(4);
  const [anonymous, setAnonymous] = useState(false);
  const [sent, setSent] = useState(3);
  const [remainingCards, setRemainingCards] = useState(cards.slice(3).map((card) => card.id));
  const [secondsLeft, setSecondsLeft] = useState(462);
  const [justSent, setJustSent] = useState(false);
  const t = copy[language];
  const activeCard = useMemo(() => cards.find((card) => card.id === selectedCard) ?? cards[0], [selectedCard]);

  useEffect(() => {
    const timer = window.setInterval(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const timeDisplay = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;

  function sendCard() {
    if (sent >= 10 || !activeCard) return;
    setSent((value) => value + 1);
    const nextCards = remainingCards.filter((id) => id !== selectedCard);
    setRemainingCards(nextCards);
    if (nextCards.length) setSelectedCard(nextCards[0]);
    setJustSent(true);
    window.setTimeout(() => setJustSent(false), 1800);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="border-b-2 border-dashed border-[#6b4d3a]/30 bg-[#fff9ed]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-11 -rotate-3 place-items-center rounded-[45%_55%_48%_52%] border-2 border-[#5d4638] bg-primary text-primary-foreground shadow-[3px_4px_0_#f3c86b]"><Heart className="size-5 fill-current" /></span>
            <div><div className="font-heading text-xl font-black leading-none tracking-[-.04em]">PowerBox <span className="text-primary">♡</span></div><div className="mt-1 text-[11px] font-semibold text-muted-foreground">{t.subtitle}</div></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border-2 border-[#5d4638] bg-[#d9eee3] px-3 py-2 text-xs font-bold shadow-[2px_3px_0_#5d4638] sm:flex"><Users className="size-4 text-[#467d68]" /> {t.participants}</div>
            <button className="rounded-full border-2 border-[#5d4638] bg-[#ffe19a] px-3 py-2 text-xs font-black shadow-[2px_3px_0_#5d4638] transition hover:-translate-y-0.5" onClick={() => setLanguage(language === 'th' ? 'en' : 'th')} aria-label="Switch language">{language === 'th' ? 'TH · EN' : 'EN · TH'}</button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-9">
        <div className="hero-paper relative mb-6 min-h-48 overflow-hidden rounded-[30px_24px_32px_22px] border-2 border-[#5d4638] bg-[#fff6df] shadow-[5px_6px_0_#efb9aa]">
          <img src="/powerbox-friends.png" alt="Friends exchanging a positive card" className="absolute inset-0 h-full w-full object-cover object-center sm:object-[60%_52%]" />
          <div className="relative z-10 flex min-h-48 max-w-[54%] flex-col justify-center p-5 sm:p-8">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[.14em] text-[#467d68] sm:text-xs"><Sparkles className="size-4" /> {t.room} · BLOOM-24</div>
            <h1 className="font-heading text-2xl font-black tracking-[-.04em] sm:text-4xl">{t.hello}</h1>
            <p className="mt-2 hidden text-sm font-semibold text-muted-foreground sm:block sm:text-base">{t.prompt}</p>
          </div>
          <div className="absolute bottom-3 left-4 z-10 flex items-center justify-between gap-3 rounded-2xl border-2 border-[#5d4638] bg-white/95 px-4 py-2 shadow-[3px_4px_0_#5d4638] sm:bottom-5 sm:left-auto sm:right-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"><Clock3 className="size-4 text-primary" /> {t.time}</div>
            <span className="font-heading text-2xl font-extrabold tabular-nums text-primary">{timeDisplay}</span>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[30px_24px_28px_22px] border-2 border-[#5d4638] bg-white p-5 shadow-[5px_6px_0_#f1c86f] sm:p-7">
            <div className="mb-7 flex items-center gap-4">
              <Progress value={sent * 10} className="flex-1 [&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-track]]:bg-[#f3e9dc] [&_[data-slot=progress-indicator]]:bg-primary" />
              <span className="min-w-24 text-right text-sm font-bold">{t.progress} {sent}/10</span>
            </div>
            <section>
              <h2 className="mb-3 text-sm font-extrabold">{t.selectPerson}</h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {people.map((item) => <button key={item.name} onClick={() => setPerson(item)} className={`flex min-w-20 flex-col items-center gap-2 rounded-[20px_16px_22px_15px] border-2 p-3 transition ${person.name === item.name ? 'border-[#5d4638] bg-[#fff3dd] shadow-[3px_3px_0_#efb9aa]' : 'border-transparent hover:bg-muted'}`}><span className={`grid size-11 place-items-center rounded-[48%_52%_45%_55%] border-2 border-[#5d4638] ${item.color} text-sm font-black`}>{item.initials}</span><span className="text-xs font-black">{item.name}</span></button>)}
                <button className="flex min-w-20 flex-col items-center gap-2 rounded-2xl p-3 text-muted-foreground hover:bg-muted"><span className="grid size-11 place-items-center rounded-full border border-dashed border-[#cbbdaf] bg-white"><ChevronDown className="size-4" /></span><span className="text-xs font-bold">+ 43</span></button>
              </div>
            </section>
            <section className="mt-6">
              <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-extrabold">{t.selectCard}</h2><span className="text-xs text-muted-foreground">{t.recipient}: <strong className="text-foreground">{person.name}</strong></span></div>
              <div className="grid max-h-[390px] gap-3 overflow-y-auto pr-1 sm:grid-cols-3">
                {cards.filter((card) => remainingCards.includes(card.id)).map((card) => <button key={card.id} onClick={() => setSelectedCard(card.id)} className={`relative min-h-40 rounded-[24px_19px_27px_18px] border-2 border-[#5d4638] p-5 text-left transition hover:-translate-y-1 ${card.tone} ${selectedCard === card.id ? 'rotate-[-1deg] shadow-[4px_5px_0_#e96b50]' : 'shadow-[2px_3px_0_#decdb7]'}`}>{selectedCard === card.id && <span className="absolute right-3 top-3 grid size-6 place-items-center rounded-full border-2 border-[#5d4638] bg-primary text-white"><Check className="size-3" /></span>}<span className="text-2xl">{card.emoji}</span><p className="mt-5 text-sm font-black leading-relaxed">{card[language]}</p></button>)}
              </div>
            </section>
            <div className="mt-6 flex flex-col gap-4 border-t border-[#efe6db] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex cursor-pointer items-center gap-3"><Switch checked={anonymous} onCheckedChange={setAnonymous} /><span><span className="block text-sm font-bold">{t.anonymous}</span><span className="block text-xs text-muted-foreground">{t.anonymousHelp}</span></span></label>
              <Button onClick={sendCard} disabled={sent >= 10} size="lg" className="h-12 rounded-[18px_14px_20px_13px] border-2 border-[#5d4638] px-7 text-sm font-black shadow-[4px_5px_0_#5d4638] hover:-translate-y-0.5">{justSent ? <Check /> : <Send />} {justSent ? t.sent : t.send}</Button>
            </div>
          </div>

          <aside className="rounded-[26px_32px_24px_29px] border-2 border-[#5d4638] bg-[#88bda7] p-6 text-[#35291f] shadow-[5px_6px_0_#5d4638]">
            <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#afd0c0]">{t.inbox}</p><p className="mt-2 font-heading text-xl font-extrabold">{t.inboxCount}</p></div><Gift className="size-6 text-[#ffd58f]" /></div>
            <div className="relative mx-auto my-9 h-44 max-w-56">
              <div className="absolute left-1/2 top-0 h-32 w-40 -translate-x-1/2 rotate-[-5deg] rounded-[20px_15px_24px_17px] border-2 border-[#5d4638] bg-[#f7c7bc] p-4 text-[#49352e] shadow-[3px_4px_0_#5d4638]"><Heart className="size-5 fill-current" /></div>
              <div className="absolute left-1/2 top-3 h-32 w-40 -translate-x-1/2 rotate-[6deg] rounded-[22px_17px_20px_14px] border-2 border-[#5d4638] bg-[#f5d797] p-4 text-[#49352e] shadow-[3px_4px_0_#5d4638]"><Sparkles className="size-5" /></div>
              <div className="absolute bottom-0 left-1/2 grid h-28 w-52 -translate-x-1/2 place-items-center rounded-[22px_16px_25px_18px] border-2 border-[#5d4638] bg-[#e8694d] text-white shadow-[4px_5px_0_#5d4638]"><LockKeyhole className="size-7" /></div>
            </div>
            <div className="rounded-[20px_16px_22px_15px] border-2 border-[#5d4638] bg-[#fff9ed] p-4 text-center shadow-[3px_3px_0_#5d4638]"><p className="text-sm font-black">{t.locked}</p><p className="mt-1 text-xs font-bold text-[#467d68]">{timeDisplay}</p></div>
            <div className="mt-4 flex gap-3 rounded-[18px_22px_16px_20px] border-2 border-[#5d4638] bg-[#ffe19a] p-4"><Sparkles className="mt-0.5 size-4 shrink-0 text-[#e8694d]" /><p className="text-xs font-bold leading-relaxed">{t.appGift}</p></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
