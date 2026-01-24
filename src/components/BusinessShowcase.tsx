"use client";
import { motion } from "framer-motion";

export default function BusinessShowcase({ data }: { data: any }) {
  return (
    <div className="bg-slate-900 rounded-[3rem] p-8 border border-white/5 my-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* VIDEO INTERVIEW */}
        <div className="rounded-[2rem] overflow-hidden border-2 border-blue-500/30 shadow-2xl aspect-video bg-black relative">
          <video src={data.interview_video_url} controls className="w-full h-full object-cover" />
          <div className="absolute top-4 left-4 bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full">CEO INTERVIEW</div>
        </div>

        {/* CEO DETAILS */}
        <div className="space-y-4">
          <h2 className="text-3xl font-black italic text-white uppercase">{data.company_name}</h2>
          <p className="text-blue-400 font-bold text-xs">Lead by {data.ceo_name}</p>
          <p className="text-slate-400 text-sm leading-relaxed">{data.bio}</p>
          
          {/* AUTO-SCROLLING GALLERY */}
          <motion.div
            className="flex gap-4 overflow-x-auto py-4 no-scrollbar"
            initial={{ x: 0 }}
            animate={{ x: -100 }}
            transition={{ repeat: Infinity, duration: 10 }}
          >
            {data.gallery_images.map((img: string, i: number) => (
              <img key={i} src={img} className="w-32 h-32 rounded-2xl object-cover border border-white/10 flex-shrink-0" />
            ))}
          </motion.div>
          
          <button className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase hover:bg-blue-600 hover:text-white transition">
            CONTACT COMPANY & SHARE
          </button>
        </div>
      </div>
    </div>
  );
}