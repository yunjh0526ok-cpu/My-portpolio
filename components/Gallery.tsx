import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Maximize2, Newspaper, Calendar, ExternalLink } from 'lucide-react';

const GALLERY_IMAGES = [
  { 
    id: 1, 
    // Lecture/Seminar vibe (Formal)
    url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop', 
    title: '국가청렴권익교육원 강의현장', 
    desc: 'ACRC Integrity Lecture',
    date: '2023.05.20',
    link: 'https://edu.acrc.go.kr/0302/lecturer/yEYijtPPTsxXYRUcAPed/view.do?_search=true&keyword=%C1%D6%BE%E7%BC%F8'
  },
  { 
    id: 2, 
    // Asian team working together
    url: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=800&auto=format&fit=crop', 
    title: 'Ethics-CoreAI 워크숍', 
    desc: 'Ethics Strategy Workshop',
    date: '2023.09.15',
    link: 'https://blog.naver.com/yszoo1467'
  },
  { 
    id: 3, 
    // Proactive discussion
    url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop', 
    title: '적극행정/규제혁신 워크숍', 
    desc: 'Proactive Admin & Innovation',
    date: '2024.01.10',
    link: 'https://www.mpm.go.kr/proactivePublicService/govdatacenter/cardnews-data/?boardId=bbs_0000000000000199&mode=view&cntId=149&category=%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD&pageIdx='
  },
  { 
    id: 4, 
    // Medical/Professional setting
    url: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=800&auto=format&fit=crop', 
    title: '의료기관평가인증원 청렴시민감사관', 
    desc: 'KOIHA Integrity Auditor',
    date: '2024.02.28',
    link: 'https://www.koiha.or.kr/web/kr/koihaPR/photoGallery_g_view_h.do'
  },
  { 
    id: 5, 
    // Advisory/Planning (Table meeting)
    url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop', 
    title: '국토지리정보원 자문위원', 
    desc: 'NGII Advisory Council',
    date: '2024.03.15',
    link: '#'
  },
  { 
    id: 6, 
    // Education/Training
    url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=800&auto=format&fit=crop', 
    title: '교육부/서울시교육청 강의', 
    desc: 'Public Education Lecture',
    date: '2024.04.05',
    link: '#'
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
          <motion.a
            key={img.id}
            href={img.link}
            target={img.link !== '#' ? "_blank" : undefined}
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative h-[300px] w-full bg-[#0a0a12] border border-slate-800 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:border-[#ff6e1e]/50 transition-all duration-300 block hover:-translate-y-2"
          >
            {/* Image Container */}
            <div className="h-[60%] w-full overflow-hidden relative">
                <img 
                    src={img.url} 
                    alt={img.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-[#0a0a12]/50 to-transparent opacity-80" />
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white flex items-center gap-1 group-hover:bg-[#ff6e1e] transition-colors">
                    {img.link !== '#' ? 'VIEW LINK' : 'VIEW IMAGE'} <ExternalLink className="w-3 h-3" />
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
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default Gallery;