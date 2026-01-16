import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Maximize2, Newspaper, Calendar } from 'lucide-react';

// Reverted to aesthetic/high-end abstract business images
const GALLERY_IMAGES = [
  { 
    id: 1, 
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop', 
    title: '[보도] 국가청렴권익교육원 전문강사 위촉식', 
    desc: 'National Integrity Institute',
    date: '2023.05.20'
  },
  { 
    id: 2, 
    url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop', 
    title: '[현장] 인사혁신처 적극행정 워크숍 주관', 
    desc: 'MPM Proactive Workshop',
    date: '2023.09.15'
  },
  { 
    id: 3, 
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop', 
    title: '[인터뷰] 의료기관 인증평가 혁신 자문', 
    desc: 'Medical Audit Consultation',
    date: '2024.01.10'
  },
  { 
    id: 4, 
    url: 'https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=800&auto=format&fit=crop', 
    title: '[포토] 국토지리정보원 자문위원 회의', 
    desc: 'NGII Advisory Committee',
    date: '2024.02.28'
  },
  { 
    id: 5, 
    url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop', 
    title: '[강연] 서울시교육청 청렴 리더십 연수', 
    desc: 'Seoul Education Leadership',
    date: '2024.03.15'
  },
  { 
    id: 6, 
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop', 
    title: '[특집] Ethics-Core AI 솔루션 시연회', 
    desc: 'AI Solution Launch Event',
    date: '2024.04.05'
  },
];

const Gallery: React.FC = () => {
  return (
    <section className="relative z-10 py-24 px-4 w-full max-w-7xl mx-auto border-b border-slate-800/50">
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 px-4">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-[#ff6e1e]/10 text-[#ff6e1e] text-xs font-bold rounded-full border border-[#ff6e1e]/20 flex items-center gap-1">
                    <Newspaper className="w-3 h-3" /> PRESS RELEASE
                </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">MEDIA & ACTIVITY</h2>
            <p className="text-slate-400 font-mono text-sm md:text-base">주요 언론 보도 및 현장 활동 기록</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-slate-500 text-sm mt-4 md:mt-0">
            <Camera className="w-4 h-4" />
            <span>Field Records 2023-2024</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GALLERY_IMAGES.map((img, index) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative h-[300px] w-full bg-[#0a0a12] border border-slate-800 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:border-[#ff6e1e]/50 transition-colors duration-300"
          >
            {/* Image Container */}
            <div className="h-[60%] w-full overflow-hidden relative">
                <img 
                    src={img.url} 
                    alt={img.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-[#0a0a12]/50 to-transparent opacity-80" />
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white flex items-center gap-1">
                    <Maximize2 className="w-3 h-3" /> CLICK
                </div>
            </div>
            
            {/* Text Content */}
            <div className="p-5 flex flex-col justify-between h-[40%] bg-[#0a0a12]">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[#ff6e1e] text-[10px] font-bold tracking-wider uppercase">{img.desc}</span>
                        <span className="text-slate-500 text-[10px] flex items-center gap-1"><Calendar className="w-3 h-3" /> {img.date}</span>
                    </div>
                    <h3 className="text-white text-lg font-bold leading-tight group-hover:text-[#ff6e1e] transition-colors break-keep">
                        {img.title}
                    </h3>
                </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;