import { Sparkles, Github, Twitter, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-20 py-12 px-8 border-t border-white/5 bg-[#0b0f1a]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Talent<span className="text-indigo-400">Scope</span></span>
          </div>
          <p className="text-sm text-white/40 max-w-xs leading-relaxed">
            Empowering high-achieving professionals through intelligent AI analysis and strategic career guidance.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-6">Product</h4>
          <ul className="space-y-3 text-sm text-white/50">
            <li className="hover:text-indigo-400 transition-colors cursor-pointer">ATS Analyzer</li>
            <li className="hover:text-indigo-400 transition-colors cursor-pointer">Skill Mapping</li>
            <li className="hover:text-indigo-400 transition-colors cursor-pointer">Job Matching</li>
            <li className="hover:text-indigo-400 transition-colors cursor-pointer">Enterprise</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-6">Connect</h4>
          <div className="flex gap-4">
             <div className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
               <Twitter size={18} />
             </div>
             <div className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
               <Linkedin size={18} />
             </div>
             <div className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
               <Github size={18} />
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">
        <div>© 2026 TalentScope Intelligence Systems. All rights reserved.</div>
        
        <div className="flex gap-8">
           <span>Terms of Service</span>
           <span>Privacy Policy</span>
           <span>Security</span>
        </div>
      </div>
    </footer>
  );
};
