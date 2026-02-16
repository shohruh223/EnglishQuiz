import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  CheckCircle,
  XCircle,
  ChevronRight,
  RotateCcw,
  LayoutDashboard,
  List,
  Plus,
  Trash2,
  Save,
  BrainCircuit,
  LogOut,
  Moon,
  Sun,
  Edit3,
  Check,
  X,
  Loader2,
  FileJson,
  Eye,
  Search,
  ArrowLeft,
  Upload,
  AlertCircle,
  AlertTriangle,
  BookOpen
} from 'lucide-react';

/* --- CONFIGURATION --- */
const apiKey = "";

/* --- MOCK DATA --- */
const MOCK_SECTIONS = [
  { id: '1', name: 'Essential Words 1', description: 'Ingliz tili asosiy so\'z boyligi (A1-A2)', order: 1, questionCount: 2 },
  { id: '2', name: 'Oxford Word Skills', description: 'Academic Vocabulary (B1-B2)', order: 2, questionCount: 1 },
];

// Darslar ro'yxatini oldindan belgilab qo'yamiz (har bir bo'lim uchun)
const PREDEFINED_LESSONS = {
  '1': Array.from({length: 14}, (_, i) => `Unit ${i + 1}`),
  '2': Array.from({length: 10}, (_, i) => `Unit ${i + 1}`),
};

const MOCK_QUESTIONS = [
  {
    id: '101',
    section_id: '1',
    topic: 'Unit 1',
    question: 'Ambitious', // Inglizcha so'z
    choices: ['Mehnatsevar', 'Oliyjanob', 'Maqsad sari intiluvchan', 'Dangasa'], // O'zbekcha variantlar
    correct_index: 2,
    explanation: 'Ambitious - katta maqsadlari bor, o\'ziga ishongan inson (Maqsad sari intiluvchan).',
    difficulty: 'medium',
    tags: ['vocabulary', 'adjectives'],
    status: 'published',
    created_at: new Date().toISOString()
  },
  {
    id: '102',
    section_id: '1',
    topic: 'Unit 2',
    question: 'Qaror qilmoq', // O'zbekcha so'z
    choices: ['To decide', 'To make', 'To do', 'To wonder'], // Inglizcha variantlar
    correct_index: 0,
    explanation: '"Qaror qilmoq" ingliz tilida "To decide" bo\'ladi.',
    difficulty: 'easy',
    tags: ['vocabulary', 'verbs'],
    status: 'published',
    created_at: new Date().toISOString()
  },
  {
    id: '201',
    section_id: '2',
    topic: 'Unit 1',
    question: 'Delicious',
    choices: ['Xunuk', 'Mazali', 'Sho\'r', 'Achchiq'],
    correct_index: 1,
    explanation: 'Delicious - juda mazali degan ma\'noni anglatadi.',
    difficulty: 'easy',
    tags: ['vocabulary', 'food'],
    status: 'published',
    created_at: new Date().toISOString()
  }
];

/* --- UI COMPONENTS --- */

const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false, icon: Icon, loading = false }) => {
  const base = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 dark:shadow-none",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-transparent dark:bg-red-900/20 dark:text-red-400",
    ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-200 dark:shadow-none"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base"
  };

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled || loading}>
      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : Icon && <Icon className={`w-4 h-4 ${children ? 'mr-2' : ''}`} />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, color = 'blue', className='' }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    green: "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    yellow: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    gray: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    red: "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

/* --- SHARED COMPONENTS --- */

function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-sm p-6 relative shadow-2xl bg-white dark:bg-slate-900">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4 text-red-600 dark:text-red-400 mx-auto">
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-lg font-bold mb-2 dark:text-white text-center">{title}</h3>
        <p className="text-slate-500 mb-6 text-center text-sm leading-relaxed">{message}</p>
        <div className="flex justify-center gap-3">
          <Button variant="secondary" onClick={onClose}>Bekor qilish</Button>
          <Button variant="danger" onClick={onConfirm}>O'chirish</Button>
        </div>
      </Card>
    </div>
  );
}

/* --- MAIN APP --- */

export default function App() {
  const [view, setView] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);

  // Theme Toggle State with Persistence (localStorage)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Data State
  const [sections, setSections] = useState(MOCK_SECTIONS);
  const [questions, setQuestions] = useState(MOCK_QUESTIONS);

  // Quiz State
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);

  // Theme Toggle Effect
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Bo'lim ichiga kirish (Darslarni ko'rish)
  const openSection = (sectionId) => {
    setActiveSectionId(sectionId);
    setView('lessons');
  };

  // Aniq bir Unit/Lesson bo'yicha testni boshlash
  const startQuiz = (lessonName) => {
    if (!activeSectionId) return;

    // Filter by Section ID AND Topic (Lesson Name)
    const sectionQuestions = questions.filter(q =>
        q.section_id === activeSectionId &&
        q.status === 'published' &&
        q.topic === lessonName
    );

    if (sectionQuestions.length === 0) {
        alert("Bu dars uchun hali so'zlar mavjud emas.");
        return;
    }

    setActiveQuiz({
      sectionId: activeSectionId,
      sectionName: `${sections.find(s => s.id === activeSectionId)?.name} - ${lessonName}`,
      questions: sectionQuestions,
      currentIndex: 0,
      score: 0,
      answers: {},
      isFinished: false
    });
    setView('quiz');
  };

  const handleAdminLogin = (email) => {
    if (email === 'admin@quiz.uz') {
      setIsAdmin(true);
      setView('admin');
    }
  };

  /* --- RENDERERS --- */

  if (view === 'quiz' && activeQuiz) {
    return (
      <QuizView
        quiz={activeQuiz}
        setQuiz={setActiveQuiz}
        onExit={() => setView('lessons')}
      />
    );
  }

  if (view === 'lessons' && activeSectionId) {
    return (
      <LessonsView
        sectionId={activeSectionId}
        sections={sections}
        questions={questions}
        onBack={() => setView('home')}
        onStartLesson={startQuiz}
      />
    );
  }

  if (view === 'admin' && isAdmin) {
    return (
      <AdminDashboard
        sections={sections}
        setSections={setSections}
        questions={questions}
        setQuestions={setQuestions}
        onLogout={() => { setIsAdmin(false); setView('home'); }}
      />
    );
  }

  if (view === 'login') {
    return <LoginView onLogin={handleAdminLogin} onCancel={() => setView('home')} />;
  }

  // HOME VIEW
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Check className="text-white w-5 h-5" strokeWidth={3} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Vocab<span className="text-indigo-600 dark:text-indigo-400">Master</span></h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Button variant="secondary" size="sm" onClick={() => setView('login')}>Admin</Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-16 space-y-4">
          <Badge className="mb-2" color="blue">So'z boyligini oshirish</Badge>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ingliz tili so'zlarini <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">yod oling</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Quyidagi to'plamlardan birini tanlang va so'zlarni tarjimasi bilan topish bo'yicha mashq qiling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map(section => {
            // Count total questions for this book
            const qCount = questions.filter(q => q.section_id === section.id && q.status === 'published').length;

            return (
              <Card key={section.id} className="group hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden border-slate-200/60 flex flex-col h-full">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                      <BookOpen size={28} strokeWidth={1.5} />
                    </div>
                    <Badge color="gray">{qCount} So'z</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">{section.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 line-clamp-2">
                    {section.description || "Tavsif yo'q"}
                  </p>
                  <div className="mt-auto">
                    <Button
                        className="w-full"
                        onClick={() => openSection(section.id)}
                    >
                        Boshlash <ChevronRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}

/* --- LESSONS VIEW (NEW COMPONENT) --- */

function LessonsView({ sectionId, sections, questions, onBack, onStartLesson }) {
    const section = sections.find(s => s.id === sectionId);
    let lessonList = PREDEFINED_LESSONS[sectionId] || [];

    if (lessonList.length === 0) {
        const uniqueTopics = Array.from(new Set(questions
            .filter(q => q.section_id === sectionId)
            .map(q => q.topic)
        ));
        lessonList = uniqueTopics.sort();
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={onBack} icon={ArrowLeft}>Orqaga</Button>
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                        {section?.name || 'Bo\'lim'}
                    </h1>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {lessonList.map((lessonName, idx) => {
                        const qCount = questions.filter(q => q.section_id === sectionId && q.topic === lessonName && q.status === 'published').length;

                        return (
                            <button
                                key={idx}
                                onClick={() => onStartLesson(lessonName)}
                                disabled={qCount === 0}
                                className={`text-left p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between h-32 group relative overflow-hidden
                                    ${qCount > 0
                                        ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:shadow-md cursor-pointer'
                                        : 'bg-slate-100 dark:bg-slate-900 border-transparent opacity-70 cursor-not-allowed'}`
                                }
                            >
                                <div className="z-10">
                                    <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1 block">Dars {idx + 1}</span>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{lessonName}</h3>
                                </div>
                                <div className="z-10 flex items-center justify-between mt-2">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${qCount > 0 ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'bg-slate-200 text-slate-500 dark:bg-slate-800'}`}>
                                        {qCount} So'z
                                    </span>
                                    {qCount > 0 && <Play size={20} className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0" fill="currentColor" />}
                                </div>
                                {/* Decorative circle */}
                                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                            </button>
                        );
                    })}
                </div>
                {lessonList.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        Bu bo'limda hali darslar shakllantirilmagan.
                    </div>
                )}
            </main>
        </div>
    );
}

/* --- LOGIN VIEW --- */
function LoginView({ onLogin, onCancel }) {
  const [email, setEmail] = useState('admin@quiz.uz');
  const [password, setPassword] = useState('demo123');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            <LayoutDashboard className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Tizimi</h2>
          <p className="text-slate-500 text-sm mt-2">Iltimos, kirish uchun ma'lumotlarni kiriting</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Parol</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <Button className="w-full mt-2" onClick={() => onLogin(email)}>Kirish</Button>
          <Button variant="ghost" className="w-full" onClick={onCancel}>Orqaga qaytish</Button>
        </div>
      </Card>
    </div>
  );
}

/* --- QUIZ GAME VIEW --- */
function QuizView({ quiz, setQuiz, onExit }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const currentQ = quiz.questions[quiz.currentIndex];
  const isLast = quiz.currentIndex === quiz.questions.length - 1;
  const hasAnswered = quiz.answers.hasOwnProperty(quiz.currentIndex);
  const selectedIdx = quiz.answers[quiz.currentIndex];
  const isCorrect = hasAnswered && selectedIdx === currentQ.correct_index;

  useEffect(() => {
    const handleKey = (e) => {
      if (hasAnswered) {
        if (e.key === 'Enter') nextQuestion();
        return;
      }
      if (['1','2','3','4'].includes(e.key)) handleAnswer(parseInt(e.key) - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [hasAnswered, quiz.currentIndex]);

  const handleAnswer = (idx) => {
    if (hasAnswered) return;
    const correct = idx === currentQ.correct_index;
    setQuiz(prev => ({
      ...prev,
      score: correct ? prev.score + 1 : prev.score,
      answers: { ...prev.answers, [prev.currentIndex]: idx }
    }));
  };

  const nextQuestion = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      if (isLast) {
        setQuiz(prev => ({ ...prev, isFinished: true }));
      } else {
        setQuiz(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
      }
      setIsAnimating(false);
    }, 200);
  };

  if (quiz.isFinished) {
    const percentage = Math.round((quiz.score / quiz.questions.length) * 100);
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 animate-in zoom-in-95">
          <div className="text-center mb-8">
            <div className="mb-6 inline-flex p-4 rounded-full bg-slate-100 dark:bg-slate-800">
              {percentage >= 80 ? <div className="text-4xl">🏆</div> :
               percentage >= 50 ? <div className="text-4xl">👍</div> :
               <div className="text-4xl">📚</div>}
            </div>
            <h2 className="text-3xl font-bold mb-2 dark:text-white">Natijalar</h2>
            <p className="text-slate-500">{quiz.sectionName} yakunlandi</p>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-center">
              <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-1">Ball</div>
              <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{quiz.score}</div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl text-center">
              <div className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">Aniqlik</div>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{percentage}%</div>
            </div>
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-center">
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">Jami</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{quiz.questions.length}</div>
            </div>
          </div>
          <div className="space-y-4 max-h-60 overflow-y-auto mb-8 pr-2 custom-scrollbar">
            {quiz.questions.map((q, idx) => {
              const userAns = quiz.answers[idx];
              const isRight = userAns === q.correct_index;
              return (
                <div key={idx} className={`p-4 rounded-xl border ${isRight ? 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800' : 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800'}`}>
                  <div className="flex items-start gap-3">
                    {isRight ? <CheckCircle className="text-green-600 w-5 h-5 shrink-0 mt-0.5" /> : <XCircle className="text-red-600 w-5 h-5 shrink-0 mt-0.5" />}
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">{idx + 1}. {q.question}</p>
                      <p className="text-xs text-slate-500">
                        Javob: <span className="font-semibold">{q.choices[q.correct_index]}</span>
                        {!isRight && <span> (Siz: {q.choices[userAns]})</span>}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={onExit}>Darslar ro'yxati</Button>
            <Button className="flex-1" onClick={() => window.location.reload()}>Qaytadan</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center">
      <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onExit} icon={ArrowLeft}>Chiqish</Button>
          <div className="flex flex-col items-center">
             <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">So'z</span>
             <span className="text-lg font-bold text-slate-900 dark:text-white">{quiz.currentIndex + 1} <span className="text-slate-400 text-sm font-normal">/ {quiz.questions.length}</span></span>
          </div>
          <div className="w-20 flex justify-end">
             <Badge color={currentQ.difficulty === 'easy' ? 'green' : currentQ.difficulty === 'medium' ? 'yellow' : 'red'}>
               {currentQ.difficulty === 'easy' ? 'Oson' : currentQ.difficulty === 'medium' ? 'O\'rta' : 'Qiyin'}
             </Badge>
          </div>
        </div>
        <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full bg-indigo-600 transition-all duration-500 ease-out rounded-r-full" style={{ width: `${((quiz.currentIndex + 1) / quiz.questions.length) * 100}%` }} />
        </div>
      </div>
      <div className={`flex-1 w-full max-w-3xl p-6 flex flex-col justify-center transition-opacity duration-200 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
        <div className="mb-10 text-center">
            <div className="text-slate-500 text-sm uppercase tracking-wider mb-2 font-medium">Tarjimasini toping</div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">{currentQ.question}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentQ.choices.map((choice, idx) => {
            const isSelected = selectedIdx === idx;
            const isCorrectChoice = idx === currentQ.correct_index;
            let cardClass = "hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer";
            let indicator = <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-colors">{['A','B','C','D'][idx]}</div>;
            if (hasAnswered) {
              cardClass = "cursor-default opacity-60";
              if (isCorrectChoice) {
                cardClass = "bg-green-50 border-green-500 shadow-md shadow-green-100 dark:bg-green-900/20 dark:border-green-600 dark:shadow-none opacity-100 ring-1 ring-green-500";
                indicator = <div className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center"><Check size={18} strokeWidth={3} /></div>;
              } else if (isSelected) {
                cardClass = "bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-600 opacity-100";
                indicator = <div className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center"><X size={18} strokeWidth={3} /></div>;
              }
            } else if (isSelected) {
               cardClass = "border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50 dark:bg-indigo-900/20";
            }
            return (
              <div key={idx} onClick={() => handleAnswer(idx)} className={`group relative p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all duration-200 flex items-center gap-4 h-full ${cardClass}`}>
                {indicator}
                <span className={`text-lg font-medium ${hasAnswered && isCorrectChoice ? 'text-green-800 dark:text-green-200' : 'text-slate-700 dark:text-slate-200'}`}>{choice}</span>
              </div>
            );
          })}
        </div>
        <div className={`transition-all duration-300 transform ${hasAnswered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
          <div className={`p-6 rounded-2xl mb-6 flex gap-4 ${isCorrect ? 'bg-green-100/50 dark:bg-green-900/20 text-green-900 dark:text-green-100' : 'bg-red-100/50 dark:bg-red-900/20 text-red-900 dark:text-red-100'}`}>
            <div className={`p-2 rounded-full h-fit ${isCorrect ? 'bg-green-200 dark:bg-green-800' : 'bg-red-200 dark:bg-red-800'}`}>
              {isCorrect ? <Check size={20} /> : <X size={20} />}
            </div>
            <div>
              <h4 className="font-bold text-lg mb-1">{isCorrect ? "To'g'ri javob!" : "Noto'g'ri"}</h4>
              <p className="opacity-90 leading-relaxed">{currentQ.explanation}</p>
            </div>
          </div>
          <div className="flex justify-end">
             <Button onClick={nextQuestion} size="lg" className="w-full md:w-auto text-lg px-8 py-4">
               {isLast ? 'Natijalarni ko\'rish' : 'Keyingi so\'z'} <ChevronRight className="ml-2" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- ADMIN DASHBOARD --- */
function AdminDashboard({ sections, setSections, questions, setQuestions, onLogout }) {
  const [activeTab, setActiveTab] = useState('questions');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex font-sans">
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-2xl tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6" /> Admin
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem active={activeTab === 'sections'} onClick={() => setActiveTab('sections')} icon={List} label="Bo'limlar" />
          <NavItem active={activeTab === 'questions'} onClick={() => setActiveTab('questions')} icon={BrainCircuit} label="Savollar" />
          <NavItem active={activeTab === 'import'} onClick={() => setActiveTab('import')} icon={FileJson} label="Import / Export" />
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
           <NavItem active={false} onClick={onLogout} icon={LogOut} label="Chiqish" />
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8 overflow-y-auto min-h-screen">
        {activeTab === 'sections' && (
          <SectionsManager sections={sections} setSections={setSections} />
        )}
        {activeTab === 'questions' && (
          <QuestionsManager questions={questions} setQuestions={setQuestions} sections={sections} />
        )}
        {activeTab === 'import' && (
          <ImportExportManager questions={questions} setQuestions={setQuestions} sections={sections} />
        )}
      </main>
    </div>
  );
}

const NavItem = ({ active, onClick, icon: Icon, label }) => (
  <button onClick={onClick} className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all ${active ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}>
    <Icon className="w-5 h-5 mr-3" />
    {label}
  </button>
);

/* --- SECTIONS MANAGER --- */
function SectionsManager({ sections, setSections }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [deleteId, setDeleteId] = useState(null);

  const handleEdit = (section) => {
    setFormData({ name: section.name, description: section.description });
    setEditingId(section.id);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!formData.name) return;
    if (editingId) {
      setSections(sections.map(s => s.id === editingId ? { ...s, name: formData.name, description: formData.description } : s));
    } else {
      const newSection = { id: Math.random().toString(36).substr(2, 9), name: formData.name, description: formData.description, order: sections.length + 1, questionCount: 0 };
      setSections([...sections, newSection]);
    }
    setIsEditing(false); setEditingId(null); setFormData({ name: '', description: '' });
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  }

  const confirmDelete = () => {
    if (deleteId) {
      setSections(sections.filter(s => s.id !== deleteId));
      setDeleteId(null);
    }
  }

  const handleCancel = () => {
    setIsEditing(false); setEditingId(null); setFormData({ name: '', description: '' });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Bo'limlar</h1>
          <p className="text-slate-500 mt-1">Yangi bo'limlar yarating yoki mavjudlarini tahrirlang.</p>
        </div>
        <Button onClick={() => setIsEditing(true)} icon={Plus}>Yangi Bo'lim</Button>
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Bo'limni o'chirish"
        message="Haqiqatan ham bu bo'limni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi."
      />

      {isEditing && (
        <Card className="mb-8 p-6 animate-in slide-in-from-top-4 border-indigo-200 dark:border-indigo-900">
          <h3 className="font-bold mb-4 dark:text-white text-lg">{editingId ? "Bo'limni Tahrirlash" : "Yangi Bo'lim Qo'shish"}</h3>
          <div className="grid gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nomi</label>
              <input className="w-full mt-1 p-2.5 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Masalan: Essential Vocabulary" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
               <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tavsif</label>
               <input className="w-full mt-1 p-2.5 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Bo'lim haqida qisqacha..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={handleCancel}>Bekor qilish</Button>
            <Button onClick={handleSave} icon={Save}>Saqlash</Button>
          </div>
        </Card>
      )}
      <div className="grid gap-4">
        {sections.map(s => (
          <Card key={s.id} className="p-5 flex justify-between items-center group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold">{s.order}</div>
              <div>
                <h4 className="font-bold text-lg dark:text-white">{s.name}</h4>
                <p className="text-slate-500 text-sm">{s.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge color="gray">{s.questionCount || 0} so'z</Badge>
              <Button variant="ghost" size="sm" icon={Edit3} onClick={() => handleEdit(s)} />
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" icon={Trash2} onClick={() => handleDelete(s.id)} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* --- QUESTIONS MANAGER & AI & EDIT --- */

function QuestionsManager({ questions, setQuestions, sections }) {
  const [showAiModal, setShowAiModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null); // For edit modal
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setQuestions(questions.filter(q => q.id !== deleteId));
      setDeleteId(null);
    }
  };

  const handlePublish = (id) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, status: 'published' } : q));
  }

  const handleSaveQuestion = (question) => {
    if (question.id) {
      // Update existing
      setQuestions(questions.map(q => q.id === question.id ? question : q));
    } else {
      // Add new
      const newQ = { ...question, id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString() };
      setQuestions([...questions, newQ]);
    }
    setEditingQuestion(null);
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSection = filter === 'all' || q.section_id === filter;
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSection && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Lug'at Bazasi</h1>
          <p className="text-slate-500 mt-1">So'zlarni boshqarish, tahrirlash va AI yordamida yaratish.</p>
        </div>
        <div className="flex gap-2">
            <Button onClick={() => setEditingQuestion({
              section_id: sections[0]?.id || '',
              choices: ['','','',''],
              correct_index: 0,
              difficulty: 'medium',
              status: 'draft'
            })} icon={Plus}>
              Yangi So'z
            </Button>
            <Button
              onClick={() => setShowAiModal(true)}
              icon={BrainCircuit}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20"
            >
              AI Generator
            </Button>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="So'zni o'chirish"
        message="Haqiqatan ham bu savolni o'chirmoqchimisiz?"
      />

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="So'zni qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 min-w-[200px]"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Barcha Bo'limlar</option>
          {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {showAiModal && (
        <AiGeneratorModal
          sections={sections}
          onClose={() => setShowAiModal(false)}
          onGenerate={(newQuestions) => {
            setQuestions([...questions, ...newQuestions]);
            setShowAiModal(false);
          }}
        />
      )}

      {editingQuestion && (
        <QuestionEditorModal
          question={editingQuestion}
          sections={sections}
          onClose={() => setEditingQuestion(null)}
          onSave={handleSaveQuestion}
        />
      )}

      <div className="bg-white dark:bg-slate-800 shadow-sm rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">So'z / Tarjima</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Mavzu / Bo'lim</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Qiyinlik</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Holat</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Amallar</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {filteredQuestions.map(q => {
              const sectionName = sections.find(s => s.id === q.section_id)?.name || 'Noma\'lum';
              return (
                <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 max-w-md" title={q.question}>
                      {q.question}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Javob: <span className="text-indigo-600 font-medium">{q.choices[q.correct_index]}</span></div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="font-medium text-slate-900 dark:text-white">{sectionName}</div>
                    <div className="text-xs">{q.topic || 'Mavzu yo\'q'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge color={q.difficulty === 'easy' ? 'green' : q.difficulty === 'medium' ? 'yellow' : 'red'}>
                      {q.difficulty}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                      {q.status === 'published' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                          <CheckCircle className="w-3 h-3 mr-1" /> E'lon qilingan
                        </span>
                      ) : (
                        <button onClick={() => handlePublish(q.id)} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 cursor-pointer">
                           Qoralama
                        </button>
                      )}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Button variant="ghost" size="sm" icon={Edit3} onClick={() => setEditingQuestion(q)} />
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" icon={Trash2} onClick={() => handleDelete(q.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredQuestions.length === 0 && (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">So'zlar topilmadi</h3>
            <p className="text-slate-500 mt-1">Qidiruv so'zini o'zgartiring yoki yangi so'z qo'shing.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* --- QUESTION EDITOR MODAL --- */
function QuestionEditorModal({ question, sections, onClose, onSave }) {
    const [formData, setFormData] = useState({
        ...question,
        topic: question.topic || '',
        question: question.question || '',
        explanation: question.explanation || '',
    });

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleChoiceChange = (index, value) => {
        const newChoices = [...formData.choices];
        newChoices[index] = value;
        setFormData({ ...formData, choices: newChoices });
    };

    const handleSubmit = () => {
        if(!formData.question || formData.choices.some(c => !c)) {
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="w-full max-w-2xl p-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold mb-6 dark:text-white">{question.id ? "So'zni Tahrirlash" : "Yangi So'z"}</h2>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Bo'lim</label>
                            <select
                                className="w-full p-2 border rounded-lg dark:bg-slate-800"
                                value={formData.section_id}
                                onChange={(e) => handleChange('section_id', e.target.value)}
                            >
                                {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-semibold mb-1">Mavzu / Unit</label>
                             <input className="w-full p-2 border rounded-lg dark:bg-slate-800" value={formData.topic} onChange={(e) => handleChange('topic', e.target.value)} placeholder="Masalan: Unit 1" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Asosiy So'z (Inglizcha yoki O'zbekcha)</label>
                        <input
                            className="w-full p-2 border rounded-lg dark:bg-slate-800 text-lg font-medium"
                            value={formData.question}
                            onChange={(e) => handleChange('question', e.target.value)}
                            placeholder="Masalan: Beautiful"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Tarjima Variantlari (To'g'risini belgilang)</label>
                        <div className="space-y-2">
                            {formData.choices.map((choice, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="correct_index"
                                        checked={formData.correct_index === idx}
                                        onChange={() => handleChange('correct_index', idx)}
                                        className="w-4 h-4 text-indigo-600"
                                    />
                                    <input
                                        className={`flex-1 p-2 border rounded-lg dark:bg-slate-800 ${formData.correct_index === idx ? 'border-green-500 ring-1 ring-green-500' : ''}`}
                                        value={choice}
                                        onChange={(e) => handleChoiceChange(idx, e.target.value)}
                                        placeholder={`Variant ${['A','B','C','D'][idx]}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Izoh (Qisqa tarjima)</label>
                        <textarea
                            className="w-full p-2 border rounded-lg dark:bg-slate-800 h-20"
                            value={formData.explanation}
                            onChange={(e) => handleChange('explanation', e.target.value)}
                            placeholder="So'zning ma'nosi va ishlatilishi..."
                        />
                    </div>

                    <div className="flex justify-between items-center pt-4">
                          <div className="flex gap-4">
                             <select className="p-2 border rounded-lg dark:bg-slate-800" value={formData.difficulty} onChange={(e) => handleChange('difficulty', e.target.value)}>
                                 <option value="easy">Oson</option>
                                 <option value="medium">O'rta</option>
                                 <option value="hard">Qiyin</option>
                             </select>
                             <select className="p-2 border rounded-lg dark:bg-slate-800" value={formData.status} onChange={(e) => handleChange('status', e.target.value)}>
                                 <option value="draft">Qoralama</option>
                                 <option value="published">E'lon qilish</option>
                             </select>
                          </div>
                          <Button onClick={handleSubmit} icon={Save}>Saqlash</Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

/* --- IMPORT / EXPORT MANAGER --- */
function ImportExportManager({ questions, setQuestions, sections }) {
  // Export states
  const [exportSectionId, setExportSectionId] = useState('all');

  // Import states
  const [importSectionId, setImportSectionId] = useState(sections[0]?.id || '');
  const [importTopic, setImportTopic] = useState('');

  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);

  // Bo'lim o'zgarganda darslar ro'yxatini yangilash (Import uchun)
  useEffect(() => {
      const lessons = PREDEFINED_LESSONS[importSectionId] || [];
      if (lessons.length > 0) {
          setImportTopic(lessons[0]);
      } else {
          setImportTopic('');
      }
  }, [importSectionId]);

  const exportJson = () => {
    let dataToExport = questions;
    let fileName = "barcha_sozlar.json";

    if (exportSectionId !== 'all') {
      dataToExport = questions.filter(q => q.section_id === exportSectionId);
      const sectionName = sections.find(s => s.id === exportSectionId)?.name || 'bolim';
      fileName = `${sectionName.replace(/\s+/g, '_').toLowerCase()}_sozlari.json`;
    }

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!importSectionId || !importTopic) {
        setNotification({ type: 'error', message: "Iltimos, avval qaysi bo'lim va darsga yuklashni tanlang!" });
        e.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        const json = JSON.parse(result);

        if (Array.isArray(json)) {
          // Validate structure (basic check)
          const isValid = json.every(q => q.question && q.choices && q.correct_index !== undefined);

          if(isValid) {
             const newQuestions = json.map(q => ({
                 ...q,
                 id: Math.random().toString(36).substr(2, 9), // Yangi ID
                 section_id: importSectionId, // Tanlangan bo'limga majburan biriktirish
                 topic: importTopic,          // Tanlangan darsga majburan biriktirish
                 status: q.status || 'draft', // Agar status bo'lmasa, qoralama qilish
                 created_at: new Date().toISOString()
             }));

             setQuestions(prev => [...prev, ...newQuestions]);

             const sectionName = sections.find(s => s.id === importSectionId)?.name;
             setNotification({
                 type: 'success',
                 message: `Muvaffaqiyatli! ${json.length} ta so'z "${sectionName}"ning "${importTopic}" darsiga qo'shildi.`
             });
          } else {
             setNotification({ type: 'error', message: "Xatolik: JSON formatida kerakli maydonlar (question, choices...) yetishmayapti." });
          }
        } else {
             setNotification({ type: 'error', message: "Xatolik: Fayl JSON array bo'lishi kerak ([...])." });
        }
      } catch (err) {
        console.error(err);
        setNotification({ type: 'error', message: "Faylni o'qishda xatolik yuz berdi. JSON formatini tekshiring." });
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input to allow re-uploading same file
  };

  return (
     <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Import va Export</h1>

        {notification && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
             {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
             <span>{notification.message}</span>
             <button className="ml-auto opacity-50 hover:opacity-100" onClick={() => setNotification(null)}><X size={18}/></button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
           {/* IMPORT SECTION */}
           <Card className="p-8 text-center border-dashed border-2 border-slate-300 dark:border-slate-700 shadow-none hover:border-indigo-500 transition-colors flex flex-col h-full">
              <FileJson className="w-12 h-12 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">JSON yuklash</h3>
              <p className="text-slate-500 mb-6 text-sm">Savollar qaysi darsga tushishini tanlang va faylni yuklang.</p>

              <div className="space-y-3 mb-6 w-full text-left">
                  <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Bo'lim</label>
                      <select
                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        value={importSectionId}
                        onChange={(e) => setImportSectionId(e.target.value)}
                      >
                        {sections.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                  </div>
                  <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Dars / Mavzu</label>
                      <select
                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        value={importTopic}
                        onChange={(e) => setImportTopic(e.target.value)}
                        disabled={!importSectionId}
                      >
                        {importSectionId && PREDEFINED_LESSONS[importSectionId]?.map((lesson) => (
                            <option key={lesson} value={lesson}>{lesson}</option>
                        ))}
                      </select>
                  </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                className="hidden"
              />

              <div className="mt-auto w-full">
                <Button className="w-full" variant="secondary" onClick={() => fileInputRef.current?.click()} icon={Upload}>
                    Faylni tanlash
                </Button>
              </div>
           </Card>

           {/* EXPORT SECTION */}
           <Card className="p-8 text-center flex flex-col h-full">
              <Save className="w-12 h-12 mx-auto text-indigo-500 mb-4" />
              <h3 className="text-lg font-bold mb-2">Export qilish</h3>
              <p className="text-slate-500 mb-4 text-sm">Savollarni JSON formatida yuklab olish.</p>

              <div className="w-full mb-6 text-left">
                <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Qaysi bo'limdan?</label>
                <select
                    className="w-full mt-1 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    value={exportSectionId}
                    onChange={(e) => setExportSectionId(e.target.value)}
                >
                    <option value="all">Barcha so'zlar (To'liq baza)</option>
                    {sections.map(s => (
                        <option key={s.id} value={s.id}>{s.name} bo'limi</option>
                    ))}
                </select>
              </div>

              <div className="mt-auto w-full">
                <Button onClick={exportJson} icon={Save} className="w-full">
                    {exportSectionId === 'all' ? `Jami (${questions.length})` : `Yuklash`}
                </Button>
              </div>
           </Card>
        </div>
     </div>
  )
}

/* --- AI GENERATOR MODAL (Serverless Pattern) --- */

function AiGeneratorModal({ sections, onClose, onGenerate }) {
  const [topic, setTopic] = useState('');
  const [sectionId, setSectionId] = useState(sections[0]?.id || '');
  const [difficulty, setDifficulty] = useState('medium');
  const [count, setCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic) return setError("Mavzu kiritilishi shart");
    setLoading(true);
    setError('');

    try {
      // PROMPT ENGINEERING FOR VOCABULARY MATCHING
      const prompt = `
        You are a Vocabulary Quiz Generator for English-Uzbek learning.
        Task: Generate ${count} vocabulary matching questions about "${topic}".
        Difficulty: ${difficulty}.

        CRITICAL REQUIREMENT:
        - 50% of questions should be: English Word -> 4 Uzbek Options (Translation)
        - 50% of questions should be: Uzbek Word -> 4 English Options (Translation)

        RULES:
        1. Output MUST be valid JSON array inside a "questions" key.
        2. NO markdown formatting.
        3. Each question must have exactly 4 choices.
        4. "correct_index" must be 0, 1, 2, or 3.
        5. "explanation" (Izoh) must be in Uzbek, explaining the translation clearly.

        SCHEMA:
        {
          "questions": [
            {
              "question": "English or Uzbek word",
              "choices": ["Option 1", "Option 2", "Option 3", "Option 4"],
              "correct_index": 0,
              "explanation": "Qisqa izoh",
              "tags": ["tag1"]
            }
          ]
        }
      `;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json" // Force JSON mode
          }
        })
      });

      if (!response.ok) throw new Error('AI Server Xatosi');
      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;

      const parsed = JSON.parse(text);
      if (!parsed.questions || !Array.isArray(parsed.questions)) throw new Error("JSON formati noto'g'ri");

      // Transform to App Data Structure
      const newQuestions = parsed.questions.map(q => ({
        id: Math.random().toString(36).substr(2, 9),
        section_id: sectionId,
        topic: topic,
        question: q.question,
        choices: q.choices,
        correct_index: q.correct_index,
        explanation: q.explanation,
        difficulty: difficulty,
        tags: q.tags || [],
        status: 'draft', // Important: AI content is draft by default
        created_by: 'ai',
        created_at: new Date().toISOString()
      }));

      onGenerate(newQuestions);

    } catch (err) {
      console.error(err);
      setError("Xatolik yuz berdi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-lg p-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg shadow-indigo-500/30">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold dark:text-white">AI Lug'at Generatori</h2>
            <p className="text-xs text-slate-500">So'zlar bazasini AI yordamida to'ldiring</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Mavzu / Dars nomi</label>
            <input
              className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Masalan: Fruits, Business, Travel..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Bo'lim</label>
              <select
                className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
              >
                {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Qiyinlik</label>
              <select
                className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">Oson</option>
                <option value="medium">O'rta</option>
                <option value="hard">Qiyin</option>
              </select>
            </div>
          </div>

          <div>
             <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Soni (Demo uchun maks 5)</label>
             <input
               type="number" min="1" max="5"
               className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
               value={count} onChange={(e) => setCount(parseInt(e.target.value))}
             />
          </div>

          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2"><XCircle size={16} /> {error}</div>}

          <div className="pt-4 flex justify-end gap-3">
             <Button variant="ghost" onClick={onClose}>Bekor qilish</Button>
             <Button onClick={handleGenerate} disabled={loading} className="min-w-[140px]">
               {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <BrainCircuit className="w-5 h-5 mr-2" />}
               {loading ? 'Yaratilmoqda...' : 'Yaratish'}
             </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}