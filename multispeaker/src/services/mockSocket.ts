import type { SpeakerRole, TranscriptMessage } from '../types/transcript'
import { SPEAKERS } from '../utils/speakers'

const PHRASES: Record<SpeakerRole, string[]> = {
  Judge: [
    'الجلسة الآن منتظمة وسنبدأ بالبيان الأول.',
    'يرجى أن تكون الإجابات موجزة ومباشرة على السؤال المطروح.',
    'ستثبت المحكمة الاعتراض وتطلب توضيحا من الشاهد.',
  ],
  Prosecutor: [
    'تقدم النيابة التسلسل الزمني كما هو مثبت في الأدلة.',
    'نطلب من الشاهد توضيح تسلسل الأحداث في السجل.',
    'تتحرك النيابة لإثبات المستند ضمن ملف الجلسة.',
  ],
  Defendant: [
    'أؤكد أنني التزمت بالتعليمات التي تلقيتها تلك الليلة.',
    'لم أفوض التحويل الذي تم وصفه في السجل.',
    'أريد أن تفهم المحكمة أنني تصرفت بحسن نية.',
  ],
  Lawyer: [
    'تطلب هيئة الدفاع توضيحا مختصرا بشأن الشهادة.',
    'نعترض على الوصف ونطلب إعادة صياغة العبارة.',
    'ترغب هيئة الدفاع في إدراج مستند داعم ضمن الأدلة.',
  ],
  Witnesses: [
    'رأيت الأطراف يدخلون القاعة قبل بدء الجلسة بقليل.',
    'حسب ذاكرتي استمرت المناقشة قرابة عشرين دقيقة.',
    'أؤكد أن التوقيع يطابق المستند الذي ناقشناه.',
  ],
  Experts: [
    'بناء على التحليل، يشير التقرير إلى عدم وجود شذوذ في السجل.',
    'تشير النتائج إلى أن التسلسل متسق مع سجلات البيانات.',
    'تدعم التقييمات الفنية لدينا التسلسل الزمني المعروض سابقا.',
  ],
  CivilPlaintiff: [
    'يطلب المدعي بالحق المدني من المحكمة إثبات الأضرار الموثقة.',
    'نطلب إدراج مبلغ التعويض في السجل.',
    'يسعى المدعي إلى إقرار الأثر المذكور في التقرير.',
  ],
}

const TICK_INTERVAL_MS = 1000
const MIN_DELAY_MS = 1000
const MAX_DELAY_MS = 3000

type MessageCallback = (message: TranscriptMessage) => void

class MockTranscriptSocket {
  private subscribers = new Set<MessageCallback>()
  private intervalId: ReturnType<typeof setInterval> | null = null
  private connected = false
  private lastEmit = 0
  private nextDelay = MIN_DELAY_MS

  connect() {
    if (this.connected) {
      return
    }
    this.connected = true
    this.lastEmit = 0
    this.nextDelay = this.randomDelay()
    this.intervalId = setInterval(() => this.tick(), TICK_INTERVAL_MS)
  }

  disconnect() {
    this.connected = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  reconnect() {
    if (!this.connected) {
      this.connect()
      return
    }
    this.disconnect()
    setTimeout(() => this.connect(), 1400)
  } 

  subscribe(callback: MessageCallback) {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  private tick() {
    if (!this.connected) {
      return
    }
    const now = Date.now()
    if (now - this.lastEmit < this.nextDelay) {
      return
    }

    this.lastEmit = now
    this.nextDelay = this.randomDelay()

    const speaker = SPEAKERS[Math.floor(Math.random() * SPEAKERS.length)]
    const phraseList = PHRASES[speaker.role]
    const phrase = phraseList[Math.floor(Math.random() * phraseList.length)]
    const payload: TranscriptMessage = {
      id: `${speaker.id}-${now}-${Math.floor(Math.random() * 1000)}`,
      speakerId: speaker.id,
      speakerName: speaker.name,
      role: speaker.role,
      text: phrase,
      timestamp: new Date().toISOString(),
      isEdited: false,
      isMuted: false,
    }

    this.subscribers.forEach((callback) => callback(payload))
  }

  private randomDelay() {
    return Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS
  }
}

export const mockSocket = new MockTranscriptSocket()
