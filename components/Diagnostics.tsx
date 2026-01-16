import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, Users, Bot, Crown, ArrowRight, 
  Terminal, Search, BarChart3, CheckSquare, 
  ChevronRight, Siren, Send, LayoutDashboard, 
  HeartHandshake, FileEdit, Sparkles, AlertTriangle, Quote, FileText, Download
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- DATA: DIAGNOSIS CATEGORIES (Expanded to ~10 items) ---
const DIAGNOSIS_CATEGORIES = [
  { 
    id: 'corruption', 
    label: '부패 진단', 
    sub: 'Corruption Audit',
    color: 'text-yellow-500', 
    bg: 'bg-yellow-500', 
    border: 'border-yellow-500',
    icon: Scale,
    desc: '공금 횡령, 향응 수수, 사적 이익 추구 등 부패 징후 정밀 진단',
    checklist: [
      "1. 직무관련자로부터 3만원을 초과하는 식사나 선물을 관행적으로 받은 적이 있다.",
      "2. 출장비, 업무추진비를 실제 목적과 다르게 사용하거나 '카드 깡' 형태로 현금화한 적이 있다.",
      "3. 지인이나 특정 업체의 편의를 봐주기 위해 내부 정보를 유출하거나 절차를 간소화했다.",
      "4. 법인카드를 주말, 심야 시간대, 자택 근처 등 업무와 무관한 시공간에서 사용했다.",
      "5. 인사 청탁이나 이권 개입을 위한 외부의 부당한 알선/청탁을 거절하지 못했다.",
      "6. 초과 근무를 하지 않았음에도 허위로 입력하여 수당을 부정 수령했다.",
      "7. 기관의 물품이나 예산을 개인적인 동호회 활동이나 사적 용도로 사용했다.",
      "8. 외부 강의나 자문료를 신고하지 않거나 규정된 상한액을 초과하여 수령했다.",
      "9. 직무 관련자에게 경조사비를 과도하게 받거나 이를 암묵적으로 요구했다.",
      "10. 퇴직 후 취업을 목적으로 특정 기업에 유리한 특혜를 제공한 정황이 있다."
    ]
  },
  { 
    id: 'gapjil', 
    label: '갑질 진단', 
    sub: 'Power Abuse',
    color: 'text-[#ff6e1e]', 
    bg: 'bg-[#ff6e1e]', 
    border: 'border-[#ff6e1e]',
    icon: Crown,
    desc: '우월적 지위를 이용한 부당한 지시 및 인격 모독 행위 분석',
    checklist: [
      "1. 다른 직원들이 보는 앞에서 공개적으로 모욕적인 언행이나 인격 비하 발언을 했다.",
      "2. 업무와 무관한 사적인 심부름(개인 택배, 가족 행사 지원, 대리 운전 등)을 지시했다.",
      "3. 정당한 사유 없이 연차 휴가 사용을 승인하지 않거나 사용 시 눈치를 주며 비난했다.",
      "4. 퇴근 시간 직전이나 주말, 공휴일에 불필요한 업무 지시를 반복적으로 내렸다.",
      "5. 회식 참여를 강요하거나, 원하지 않는 음주/장기자랑 등을 억지로 시켰다.",
      "6. 특정 직원을 주요 회의나 정보 공유에서 의도적으로 배제하여 '투명 인간' 취급했다.",
      "7. 본인의 업무 책임을 부하 직원에게 전가하거나 성과를 가로챘다.",
      "8. 외모, 신체적 특징, 출신 지역, 학력 등을 비하하거나 조롱하는 발언을 했다.",
      "9. 업무 시간 외에 카톡 등으로 사적인 연락을 하거나 답장을 강요했다.",
      "10. 승진, 인사 평가 등을 빌미로 불이익을 주겠다고 위협하거나 협박했다."
    ]
  },
  { 
    id: 'euljil', 
    label: '을질 진단', 
    sub: 'Reverse Abuse',
    color: 'text-cyber-purple', 
    bg: 'bg-cyber-purple', 
    border: 'border-cyber-purple',
    icon: Users,
    desc: '정당한 업무 지시 거부, 집단 태업 등 역방향 괴롭힘 진단',
    checklist: [
      "1. 관리자의 정당한 업무 지시를 고의적으로 무시하거나 이유 없이 지연시켰다.",
      "2. 익명 커뮤니티나 블라인드 등에 상사에 대한 허위 사실이나 악의적 비방글을 유포했다.",
      "3. 자신의 업무 소홀이나 실수에 대한 지적을 '괴롭힘'이라며 악의적으로 신고하겠다고 위협했다.",
      "4. 팀 내에서 파벌을 조성하여 상사나 특정 동료를 집단적으로 따돌렸다.",
      "5. 업무 협조 요청에 대해 '내 일이 아니다'라며 무조건적으로 거부하거나 비협조적 태도를 보였다.",
      "6. 상사의 지시 내용을 몰래 녹음하여 악의적으로 편집해 유포하거나 협박 도구로 삼았다.",
      "7. 고충 처리 절차를 남용하여 반복적이고 무분별한 민원을 제기해 업무를 마비시켰다.",
      "8. 회의 시간이나 업무 중에 대놓고 딴짓을 하거나 불성실한 태도로 분위기를 흐렸다.",
      "9. 중요 업무 정보를 고의로 누락하거나 왜곡하여 상사의 의사결정을 방해했다.",
      "10. 결재권자의 승인 없이 멋대로 업무를 처리하고 사후 통보하거나 은폐했다."
    ]
  }
];

// --- MOCK DATA FOR FALLBACK ---
const MOCK_LEGAL_ADVICE = `
**[AI 법률 분석 결과]**

**1. 핵심 법령 및 판단**
귀하께서 문의하신 사례는 **'근로기준법 제76조의2(직장 내 괴롭힘의 금지)'** 위반 소지가 매우 높습니다. 
특히 "공개적인 장소에서의 모욕적 언사"는 형법상 **'모욕죄(제311조)'** 또는 **'명예훼손죄(제307조)'**가 성립될 수 있는 중대한 사안입니다.

**2. 관련 판례 (대법원 2021도****)**
유사한 판례에서 법원은 "피해자에게 심한 정신적 고통을 주고 근무 환경을 악화시키는 행위"를 불법 행위로 인정하여 가해자에게 위자료 지급 판결을 내린 바 있습니다.

**3. 전문가 제언**
많이 힘드시겠지만, 감정적인 대응보다는 냉철한 증거 확보가 우선입니다. '보안 신고' 탭의 [리포트 생성] 기능을 통해 사건 일지를 작성하시고, 녹취나 동료의 진술서를 확보하시기 바랍니다. 당신의 잘못이 아닙니다. 법은 당신의 편입니다.
`;

const Diagnostics: React.FC = () => {
  // Tab State
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'tactics' | 'counseling'>('diagnosis');

  // --- TAB 1: DIAGNOSIS STATE ---
  const [diagCategory, setDiagCategory] = useState<string | null>(null);
  const [diagStep, setDiagStep] = useState<'select' | 'check' | 'result'>('select');
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  
  // --- TAB 2: TACTICS STATE (Mind Care -> Analysis -> Report) ---
  const [tacticsStep, setTacticsStep] = useState<'mindcare' | 'analysis' | 'report'>('mindcare');
  const [tacticsInput, setTacticsInput] = useState(''); // Situation description
  const [generatedReport, setGeneratedReport] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // --- TAB 3: COUNSELING STATE ---
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize API
  const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog, isTyping]);

  useEffect(() => {
    // Reset states on tab change
    setDiagStep('select');
    setDiagCategory(null);
    setCheckedItems([]);
    setTacticsStep('mindcare');
    setTacticsInput('');
    setGeneratedReport('');
  }, [activeTab]);


  // --- HANDLERS: TAB 1 (DIAGNOSIS) ---
  const selectCategory = (id: string) => {
    setDiagCategory(id);
    setDiagStep('check');
    setCheckedItems([]);
  };

  const toggleCheck = (idx: number) => {
    if (checkedItems.includes(idx)) {
      setCheckedItems(prev => prev.filter(i => i !== idx));
    } else {
      setCheckedItems(prev => [...prev, idx]);
    }
  };

  const finishDiagnosis = () => {
    setDiagStep('result');
  };

  const startConsultFromDiagnosis = () => {
    const category = DIAGNOSIS_CATEGORIES.find(c => c.id === diagCategory);
    const initialMsg = `[${category?.label} 결과 상담] 체크리스트 10개 중 ${checkedItems.length}개가 해당됩니다. 특히 ${checkedItems[0] ? checkedItems[0] + 1 : 1}번 항목과 관련해 법적인 문제가 없는지 궁금합니다.`;
    setActiveTab('counseling');
    setChatLog([{ role: 'user', text: initialMsg }]);
    generateAIResponse(initialMsg);
  };

  // --- HANDLERS: TAB 2 (TACTICS) ---
  const handleTacticsGenerateReport = async () => {
    if (!tacticsInput.trim()) return;
    setIsGeneratingReport(true);
    setTacticsStep('report');

    // Simulate AI Generation time
    setTimeout(() => {
        const report = `[사건 발생 보고서 (Draft)]\n\n1. 사건 개요\n- 분석 일시: ${new Date().toLocaleDateString()}\n- 신고 유형: 직장 내 괴롭힘 및 부당 지시\n\n2. 주요 피해 진술 (요약)\n"${tacticsInput}"\n\n3. AI 법률적 쟁점 분석\n- 근로기준법 제76조 2항 '직장에서의 지위 또는 관계 등의 우위를 이용'한 행위로 추정됨.\n- 업무상 적정 범위를 넘어 신체적/정신적 고통을 주거나 근무환경을 악화시키는 행위에 해당할 소지 높음.\n\n4. 권고 조치\n- 즉시 증거 확보 (녹취, 메신저 캡처) 요망.\n- 관할 노동청 진정 제기 또는 사내 고충처리위원회 신고서 제출 권장.\n\n※ 본 리포트는 법적 효력이 있는 공문서가 아니며, 상담 및 신고를 위한 참고 자료입니다.`;
        setGeneratedReport(report);
        setIsGeneratingReport(false);
    }, 2000);
  };

  // --- HANDLERS: TAB 3 (COUNSELING) ---
  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatLog(prev => [...prev, { role: 'user', text: msg }]);
    setChatInput('');
    await generateAIResponse(msg);
  };

  const generateAIResponse = async (userMsg: string) => {
    setIsTyping(true);
    
    if (!ai) {
        // Fallback
        setTimeout(() => {
            setChatLog(prev => [...prev, { role: 'ai', text: MOCK_LEGAL_ADVICE }]);
            setIsTyping(false);
        }, 2000);
        return;
    }

    try {
        const model = ai.models.getGenerativeModel({ 
            model: "gemini-3-flash-preview", 
            systemInstruction: `
                당신은 'Ethics-Core AI'의 수석 청렴/법률 전문 상담관입니다.
                사용자는 부패, 갑질, 직장 내 괴롭힘 등으로 고통받고 있거나 윤리적 딜레마에 빠진 상태입니다.

                [행동 지침]
                1. **웹 검색 필수 (Google Search)**: 사용자의 질문에 대해 반드시 최신 '대한민국 법령(국가법령정보센터)', '대법원 판례', '권익위 가이드라인' 등을 검색하여 팩트에 기반한 정보를 제공하십시오.
                2. **따뜻한 공감**: 법률적 정보 제공 전에, 사용자의 힘든 상황에 대해 진심으로 공감하고 위로하는 멘트를 먼저 하십시오.
                3. **상세하고 친절한 설명**: 법률 용어를 쉽게 풀어서 설명하고, 구체적인 행동 요령(증거 확보 방법, 신고처 등)을 단계별로 안내하십시오.
                4. **구조화된 답변**: 
                   - [공감과 위로]
                   - [관련 법령 및 위반 여부 판단]
                   - [유사 판례 또는 사례]
                   - [실질적 해결 솔루션]
                순서로 답변하십시오.
            `,
            tools: [{ googleSearch: {} }]
        });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: userMsg }] }]
        });
        
        const responseText = result.response.text();
        setChatLog(prev => [...prev, { role: 'ai', text: responseText }]);

    } catch (error) {
        console.error("AI Error:", error);
        setChatLog(prev => [...prev, { role: 'ai', text: "시스템 연결이 지연되고 있습니다. 하지만 걱정하지 마세요. 귀하의 상황은 법적으로 충분히 보호받을 수 있습니다. 잠시 후 다시 시도해 주시면 정확한 판례를 찾아드리겠습니다." }]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <section className="relative w-full py-24 bg-[#020205] overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(19,19,43,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(19,19,43,0.3)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
        
        {/* Section Title */}
        <div className="mb-12 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-2">INTEGRITY INTELLIGENCE</h2>
            <p className="text-xl text-cyber-accent font-mono">Ethics-Core AI Digital Platform</p>
        </div>

        {/* ================= DASHBOARD CONTAINER ================= */}
        <div className="bg-[#0a0a12] border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[850px] flex flex-col relative">
          
          {/* Top Bar: Navigation Tabs */}
          <div className="flex flex-col lg:flex-row border-b border-slate-800">
            {/* Title / Logo Area */}
            <div className="p-6 md:p-8 lg:w-1/4 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/50">
               <h2 className="text-2xl font-black text-white font-tech tracking-wider flex items-center gap-3">
                 <Terminal className="w-6 h-6 text-cyber-accent" />
                 ETHICS CMD
               </h2>
               <p className="text-slate-500 text-sm mt-1">AI Integrated System</p>
            </div>

            {/* Tab Buttons */}
            <div className="flex-1 flex flex-col md:flex-row">
               {/* Tab 1: Diagnosis */}
               <button 
                 onClick={() => setActiveTab('diagnosis')}
                 className={`flex-1 relative p-6 flex flex-col justify-center items-start transition-all duration-300 group
                   ${activeTab === 'diagnosis' ? 'bg-slate-900/80' : 'bg-transparent hover:bg-slate-900/30'}
                 `}
               >
                 <div className="flex items-center gap-3 mb-2">
                    <LayoutDashboard className={`w-6 h-6 ${activeTab === 'diagnosis' ? 'text-cyber-accent' : 'text-slate-600'}`} />
                    <span className={`font-bold text-xl ${activeTab === 'diagnosis' ? 'text-white' : 'text-slate-500'}`}>부패 및 갑질 진단</span>
                 </div>
                 <p className="text-sm text-slate-500 text-left">청렴/갑질/을질 10대 항목 정밀 진단</p>
                 {activeTab === 'diagnosis' && <div className="absolute bottom-0 left-0 w-full h-1 bg-cyber-accent shadow-[0_0_10px_#06b6d4]" />}
               </button>

               <div className="w-[1px] bg-slate-800 hidden md:block" />

               {/* Tab 2: Tactics (Mind Care -> Report) */}
               <button 
                 onClick={() => setActiveTab('tactics')}
                 className={`flex-1 relative p-6 flex flex-col justify-center items-start transition-all duration-300 group
                   ${activeTab === 'tactics' ? 'bg-[#1a100d]' : 'bg-transparent hover:bg-slate-900/30'}
                 `}
               >
                 <div className="flex items-center gap-3 mb-2">
                    <HeartHandshake className={`w-6 h-6 ${activeTab === 'tactics' ? 'text-[#ff6e1e]' : 'text-slate-600'}`} />
                    <span className={`font-bold text-xl ${activeTab === 'tactics' ? 'text-white' : 'text-slate-500'}`}>AI 전술 대응</span>
                 </div>
                 <p className="text-sm text-slate-500 text-left">마음챙김·상황분석·신고서작성</p>
                 {activeTab === 'tactics' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#ff6e1e] shadow-[0_0_10px_#ff6e1e]" />}
               </button>
               
               <div className="w-[1px] bg-slate-800 hidden md:block" />

               {/* Tab 3: Counseling (Enhanced) */}
               <button 
                 onClick={() => setActiveTab('counseling')}
                 className={`flex-1 relative p-6 flex flex-col justify-center items-start transition-all duration-300 group
                   ${activeTab === 'counseling' ? 'bg-slate-900/80' : 'bg-transparent hover:bg-slate-900/30'}
                 `}
               >
                 <div className="flex items-center gap-3 mb-2">
                    <Bot className={`w-6 h-6 ${activeTab === 'counseling' ? 'text-cyber-purple' : 'text-slate-600'}`} />
                    <span className={`font-bold text-xl ${activeTab === 'counseling' ? 'text-white' : 'text-slate-500'}`}>AI 법률 상담</span>
                 </div>
                 <p className="text-sm text-slate-500 text-left">웹검색 기반 팩트 체크 및 상세 상담</p>
                 {activeTab === 'counseling' && <div className="absolute bottom-0 left-0 w-full h-1 bg-cyber-purple shadow-[0_0_10px_#8b5cf6]" />}
               </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow p-6 md:p-10 relative bg-[#050508] overflow-hidden">
            <AnimatePresence mode="wait">
              
              {/* ================= TAB 1: DIAGNOSIS (10 Items) ================= */}
              {activeTab === 'diagnosis' && (
                <motion.div
                  key="diagnosis"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="h-full flex flex-col"
                >
                    {/* Step 1: Select Category */}
                    {diagStep === 'select' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-center">
                            {DIAGNOSIS_CATEGORIES.map((cat) => (
                                <button 
                                    key={cat.id} 
                                    onClick={() => selectCategory(cat.id)}
                                    className={`relative group h-[400px] rounded-3xl border border-slate-700 bg-slate-900/40 hover:bg-slate-900 hover:border-2 hover:${cat.border} transition-all duration-300 flex flex-col items-center justify-center p-8 text-center overflow-hidden`}
                                >
                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-${cat.color.split('-')[1]}-500`} />
                                    <div className={`w-20 h-20 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:${cat.color} group-hover:border-current`}>
                                        <cat.icon className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-2">{cat.label}</h3>
                                    <span className={`text-sm font-mono uppercase tracking-widest ${cat.color} mb-6`}>{cat.sub}</span>
                                    <p className="text-slate-400 group-hover:text-slate-200 transition-colors">{cat.desc}</p>
                                    <div className={`mt-8 px-6 py-2 rounded-full border border-slate-600 text-slate-400 group-hover:bg-${cat.bg} group-hover:text-white group-hover:border-transparent transition-all flex items-center gap-2`}>
                                        진단 시작 <ArrowRight className="w-4 h-4" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 2: Checklist (Expanded) */}
                    {diagStep === 'check' && diagCategory && (
                        <div className="max-w-5xl mx-auto w-full h-full flex flex-col">
                            <div className="mb-8 flex items-center gap-4 border-b border-slate-800 pb-4">
                                <button onClick={() => setDiagStep('select')} className="p-2 hover:bg-slate-800 rounded-full text-slate-400"><ArrowRight className="w-6 h-6 rotate-180" /></button>
                                <h3 className={`text-2xl font-bold ${DIAGNOSIS_CATEGORIES.find(c=>c.id===diagCategory)?.color}`}>
                                    {DIAGNOSIS_CATEGORIES.find(c=>c.id===diagCategory)?.label} 체크리스트 (10문항)
                                </h3>
                            </div>
                            <div className="flex-grow space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                                {DIAGNOSIS_CATEGORIES.find(c=>c.id===diagCategory)?.checklist.map((item, idx) => (
                                    <div 
                                        key={idx}
                                        onClick={() => toggleCheck(idx)}
                                        className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${checkedItems.includes(idx) ? 'bg-slate-800 border-cyber-accent' : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800'}`}
                                    >
                                        <div className={`mt-1 w-6 h-6 rounded border flex items-center justify-center shrink-0 ${checkedItems.includes(idx) ? 'bg-cyber-accent border-cyber-accent' : 'border-slate-600'}`}>
                                            {checkedItems.includes(idx) && <CheckSquare className="w-4 h-4 text-black" />}
                                        </div>
                                        <span className={`text-base md:text-lg ${checkedItems.includes(idx) ? 'text-white font-medium' : 'text-slate-400'}`}>{item}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button onClick={finishDiagnosis} className="px-10 py-4 bg-cyber-600 hover:bg-cyber-500 text-white font-bold rounded-xl text-lg flex items-center gap-2 shadow-lg">
                                    진단 완료 <BarChart3 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Result */}
                    {diagStep === 'result' && (
                        <div className="max-w-3xl mx-auto w-full h-full flex flex-col items-center justify-center text-center">
                            <div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center mb-8 relative">
                                <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
                                <div 
                                    className="absolute inset-0 rounded-full border-4 border-cyber-accent border-t-transparent animate-[spin_1s_ease-out]" 
                                    style={{ clipPath: `inset(0 0 0 0)` }} 
                                />
                                <div className="flex flex-col items-center">
                                    <span className="text-4xl font-black text-white">{checkedItems.length * 10}%</span>
                                    <span className="text-xs text-slate-500 font-mono">RISK SCORE</span>
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4">
                                {checkedItems.length <= 2 ? '관심 단계 (Attention)' : checkedItems.length <= 6 ? '경고 단계 (Warning)' : '위험 단계 (Danger)'}
                            </h3>
                            <p className="text-slate-400 text-lg mb-10 max-w-lg leading-relaxed">
                                총 10개 항목 중 <strong className="text-cyber-accent">{checkedItems.length}개</strong> 항목이 해당됩니다.<br/>
                                {checkedItems.length > 0 ? 
                                    "식별된 위험 요인은 조직의 청렴도를 심각하게 훼손할 수 있습니다. AI 법률 상담을 통해 구체적인 대응책을 마련하세요." : 
                                    "현재 귀하의 상태는 매우 양호합니다. 하지만 방심은 금물입니다. 지속적인 자기 점검을 권장합니다."}
                            </p>
                            
                            <div className="flex gap-4">
                                <button onClick={() => setDiagStep('select')} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold">다시 진단</button>
                                <button onClick={startConsultFromDiagnosis} className="px-8 py-3 bg-cyber-600 hover:bg-cyber-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                                    AI 상담관에게 상세 리포트 받기 <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
              )}


              {/* ================= TAB 2: TACTICAL (Mind Care -> Analysis -> Report) ================= */}
              {activeTab === 'tactics' && (
                <motion.div
                  key="tactics"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full flex flex-col"
                >
                    {/* Header: Breadcrumbs */}
                    <div className="mb-6 flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-slate-500 justify-center md:justify-start">
                        <span className={tacticsStep === 'mindcare' ? "text-[#ff6e1e] font-bold" : ""}>1. MIND CARE</span> <ChevronRight className="w-4 h-4" />
                        <span className={tacticsStep === 'analysis' ? "text-[#ff6e1e] font-bold" : ""}>2. ANALYSIS</span> <ChevronRight className="w-4 h-4" />
                        <span className={tacticsStep === 'report' ? "text-[#ff6e1e] font-bold" : ""}>3. REPORT</span>
                    </div>

                    <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                        
                        {/* STEP 1: MIND CARE (Warm Empathy) */}
                        {tacticsStep === 'mindcare' && (
                            <div className="max-w-3xl mx-auto mt-10 text-center">
                                <motion.div 
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-24 h-24 bg-[#ff6e1e]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#ff6e1e]/30"
                                >
                                    <HeartHandshake className="w-12 h-12 text-[#ff6e1e]" />
                                </motion.div>
                                <h3 className="text-3xl font-bold text-white mb-6">당신의 잘못이 아닙니다.</h3>
                                <div className="bg-[#1a100d] p-8 rounded-3xl border border-[#ff6e1e]/20 relative">
                                    <Quote className="absolute top-6 left-6 w-8 h-8 text-[#ff6e1e]/20" />
                                    <p className="text-xl text-slate-300 leading-relaxed italic mb-6 relative z-10">
                                        "부당한 상황 앞에서 느끼는 혼란과 두려움은 당연한 감정입니다.<br/>
                                        Ethics-Core AI는 당신의 든든한 보호자가 되어드릴 것입니다.<br/>
                                        심호흡을 한번 하시고, 준비가 되셨다면 그날의 일을 들려주세요."
                                    </p>
                                    <p className="text-sm text-[#ff6e1e] font-bold">- AI 청렴 가디언 드림</p>
                                </div>
                                <button 
                                    onClick={() => setTacticsStep('analysis')}
                                    className="mt-10 px-10 py-4 bg-[#ff6e1e] hover:bg-[#e05d15] text-white font-bold rounded-full text-lg shadow-[0_0_20px_rgba(255,110,30,0.3)] flex items-center gap-2 mx-auto transition-transform hover:scale-105"
                                >
                                    네, 이야기할 준비가 되었습니다 <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {/* STEP 2: SITUATION ANALYSIS (Input) */}
                        {tacticsStep === 'analysis' && (
                            <div className="max-w-3xl mx-auto mt-4">
                                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                                    <Siren className="w-6 h-6 text-[#ff6e1e]" /> 상황 분석 및 기록
                                </h3>
                                <p className="text-slate-400 mb-6 text-sm">
                                    AI가 상황을 법률적으로 분석하고 신고서 초안을 작성합니다. 육하원칙에 따라 최대한 상세히 기술해 주세요.
                                </p>
                                <textarea 
                                    value={tacticsInput}
                                    onChange={(e) => setTacticsInput(e.target.value)}
                                    placeholder="예) 2024년 5월 20일 오후 3시경, 팀장님이 회의실에서..."
                                    className="w-full h-[400px] bg-slate-900 border border-slate-700 rounded-2xl p-6 text-white text-lg focus:border-[#ff6e1e] focus:outline-none resize-none mb-8 leading-relaxed"
                                />
                                <div className="flex justify-between items-center">
                                    <button onClick={() => setTacticsStep('mindcare')} className="text-slate-500 hover:text-white">이전으로</button>
                                    <button onClick={handleTacticsGenerateReport} disabled={!tacticsInput.trim()} className="px-10 py-4 bg-[#ff6e1e] hover:bg-[#e05d15] text-white font-bold rounded-xl text-lg shadow-[0_0_20px_rgba(255,110,30,0.3)] disabled:opacity-50 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5" /> AI 리포트 생성
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: REPORT GENERATION */}
                        {tacticsStep === 'report' && (
                            <div className="max-w-4xl mx-auto h-full flex flex-col">
                                {isGeneratingReport ? (
                                    <div className="flex-grow flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 border-4 border-[#ff6e1e] border-t-transparent rounded-full animate-spin mb-6" />
                                        <h3 className="text-2xl font-bold text-white mb-2">AI Analyzing...</h3>
                                        <p className="text-slate-500">법률적 쟁점을 분석하고 신고서 초안을 작성 중입니다.</p>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                                <FileText className="w-6 h-6 text-[#ff6e1e]" /> 생성된 신고 리포트 (Draft)
                                            </h3>
                                            <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                                                <Download className="w-4 h-4" /> PDF 다운로드
                                            </button>
                                        </div>
                                        <div className="flex-grow bg-white text-black p-8 rounded-xl overflow-y-auto shadow-2xl font-serif leading-relaxed whitespace-pre-wrap">
                                            {generatedReport}
                                        </div>
                                        <div className="mt-6 flex justify-center">
                                            <button onClick={() => setTacticsStep('mindcare')} className="text-slate-500 hover:text-white underline">처음으로 돌아가기</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
              )}


              {/* ================= TAB 3: COUNSELING (Legal Web Search) ================= */}
              {activeTab === 'counseling' && (
                  <motion.div
                    key="counseling"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="h-full flex flex-col"
                  >
                     {/* Chat Header */}
                     <div className="bg-[#13132b] p-6 rounded-t-3xl border-b border-slate-800 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-cyber-purple/20 border border-cyber-purple flex items-center justify-center">
                            <Bot className="w-6 h-6 text-cyber-purple" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">Ethics-Core AI 전문 상담관</h3>
                            <p className="text-cyber-purple text-xs font-mono flex items-center gap-2">
                                <Search className="w-3 h-3" /> WEB SEARCH ENGINE ACTIVE
                            </p>
                        </div>
                     </div>

                     {/* Chat Body */}
                     <div className="flex-grow bg-[#0a0a12] border border-t-0 border-slate-800 p-8 mb-4 overflow-y-auto rounded-b-3xl">
                        {chatLog.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                                <Bot className="w-16 h-16 text-slate-600 mb-4" />
                                <h3 className="text-2xl font-bold text-slate-400 mb-2">무엇을 도와드릴까요?</h3>
                                <p className="text-slate-500 max-w-md">
                                    "최근 대법원 판례를 기반으로 직장 내 괴롭힘 여부를 알려줘."<br/>
                                    "김영란법 선물 허용 범위와 예외 조항을 상세히 설명해줘."<br/>
                                    <strong>웹 검색을 통해 팩트에 기반한 따뜻하고 상세한 답변을 드립니다.</strong>
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {chatLog.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[90%] p-6 rounded-2xl text-lg leading-relaxed shadow-lg ${msg.role === 'user' ? 'bg-slate-700 text-white rounded-tr-none' : 'bg-[#13132b] border border-slate-700 text-slate-200 rounded-tl-none'}`}>
                                            {msg.role === 'ai' && (
                                                <div className="mb-4 pb-2 border-b border-slate-700 flex items-center justify-between">
                                                    <span className="text-xs font-bold text-cyber-purple flex items-center gap-1"><Sparkles className="w-3 h-3"/> AI LEGAL ADVICE</span>
                                                    <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded">POWERED BY GOOGLE SEARCH</span>
                                                </div>
                                            )}
                                            <div className="markdown-body whitespace-pre-wrap">{msg.text}</div>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-[#13132b] border border-slate-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                                            <div className="w-2 h-2 bg-cyber-purple rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-cyber-purple rounded-full animate-bounce delay-100" />
                                            <div className="w-2 h-2 bg-cyber-purple rounded-full animate-bounce delay-200" />
                                            <span className="text-xs text-slate-500 ml-2">법령 및 판례 검색 중...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>
                        )}
                     </div>

                     {/* Chat Input */}
                     <div className="relative">
                        <textarea 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleChatSubmit();
                                }
                            }}
                            placeholder="궁금하신 법령이나 현재 상황을 상세히 입력해주세요..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 pr-20 text-white text-lg focus:outline-none focus:border-cyber-purple resize-none h-[80px] scrollbar-hide"
                        />
                        <button 
                            onClick={handleChatSubmit}
                            disabled={!chatInput.trim() || isTyping}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-cyber-purple rounded-xl text-white hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                     </div>
                  </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Diagnostics;