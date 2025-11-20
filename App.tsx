import React, { useState, useEffect } from 'react';
import { ProjectPlan, SlideConfig } from './types';
import { generateProjectPlan } from './services/geminiService';
import { GanttChart } from './components/GanttChart';
import { ExcelView } from './components/ExcelView';
import { Presentation, ChevronLeft, ChevronRight, Loader2, Play, BarChart3, Table2, Info, Users } from 'lucide-react';

// Default slides configuration
const SLIDES: SlideConfig[] = [
  { id: 'title', type: 'title', title: 'Inicio' },
  { id: 'agenda', type: 'agenda', title: 'Agenda' },
  { id: 'justification', type: 'justification', title: 'Justificación del Proyecto' },
  { id: 'gantt', type: 'gantt', title: 'Cronograma (Diagrama de Gantt)' },
  { id: 'excel', type: 'excel', title: 'Detalle de Tareas (Vista Excel)' },
  { id: 'team', type: 'team', title: 'Equipo de Proyecto' },
  { id: 'conclusion', type: 'conclusion', title: 'Cierre' },
];

export default function App() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<ProjectPlan | null>(null);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [mode, setMode] = useState<'input' | 'presentation'>('input');

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const generatedPlan = await generateProjectPlan(topic);
      setPlan(generatedPlan);
      setMode('presentation');
      setCurrentSlideIdx(0);
    } catch (e) {
      alert("Error generating plan. Please check your API key and try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    if (currentSlideIdx < SLIDES.length - 1) setCurrentSlideIdx(c => c + 1);
  };

  const prevSlide = () => {
    if (currentSlideIdx > 0) setCurrentSlideIdx(c => c - 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode !== 'presentation') return;
      if (e.key === 'ArrowRight' || e.key === 'Space') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, currentSlideIdx]);

  if (mode === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
            <Presentation size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">GanttGen AI</h1>
          <p className="text-slate-600">
            Genera presentaciones completas de proyectos TI con diagramas de Gantt profesionales y justificación estratégica.
          </p>
          
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-slate-700">Describe tu proyecto TI</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ej. Migración a la nube AWS, Desarrollo App E-commerce..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !topic}
            className="w-full bg-primary hover:bg-secondary text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Play size={20} />}
            {loading ? 'Analizando Requerimientos...' : 'Generar Presentación'}
          </button>
          
          <p className="text-xs text-slate-400 mt-4">
            Caso 01: Elaborar un ejemplo relacionado a un proyecto relacionado a las tecnologías de la información. B) Diagrama de Gantt.
          </p>
        </div>
      </div>
    );
  }

  // Presentation Mode
  const currentSlide = SLIDES[currentSlideIdx];
  
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Toolbar */}
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2 font-semibold text-primary">
          <Presentation size={20} />
          <span>GanttGen AI</span>
        </div>
        <div className="text-sm text-slate-400">
            {currentSlideIdx + 1} / {SLIDES.length}
        </div>
        <div className="flex gap-2">
            <button onClick={() => setMode('input')} className="px-3 py-1 text-xs text-slate-400 hover:text-white">Salir</button>
        </div>
      </div>

      {/* Slide Viewport (16:9 Aspect Ratio Container) */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden">
        <div className="aspect-video w-full max-w-6xl bg-white rounded-lg shadow-2xl overflow-hidden relative flex flex-col animate-in fade-in duration-500">
          
          {/* Slide Header */}
          <div className="h-16 bg-gradient-to-r from-slate-800 to-slate-900 flex items-center px-8 justify-between shrink-0">
             <h2 className="text-white text-xl font-light tracking-wider uppercase">{plan?.title}</h2>
             <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold">IT</div>
          </div>

          {/* Slide Content */}
          <div className="flex-1 p-10 overflow-auto relative bg-slate-50">
             {currentSlide.type === 'title' && (
                 <div className="h-full flex flex-col justify-center items-start space-y-6 animate-in slide-in-from-right-10 duration-500">
                    <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest">Caso de Estudio 01</span>
                    <h1 className="text-6xl font-bold text-slate-900 leading-tight max-w-4xl">{plan?.title}</h1>
                    <p className="text-2xl text-slate-600 max-w-3xl font-light">{plan?.description}</p>
                    <div className="pt-10 flex gap-4">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Users size={20} />
                            <span>{plan?.team.length} Miembros</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <BarChart3 size={20} />
                            <span>{plan?.tasks.length} Tareas</span>
                        </div>
                    </div>
                 </div>
             )}

             {currentSlide.type === 'agenda' && (
                 <div className="h-full flex flex-col justify-center">
                     <h3 className="text-4xl font-bold text-slate-800 mb-12 border-b-4 border-primary inline-block w-24 pb-2">Agenda</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {SLIDES.slice(2, -1).map((slide, idx) => (
                            <div key={slide.id} className="flex items-center gap-6 p-6 bg-white rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <span className="text-6xl font-bold text-slate-200">0{idx + 1}</span>
                                <span className="text-xl font-medium text-slate-700">{slide.title}</span>
                            </div>
                        ))}
                     </div>
                 </div>
             )}

             {currentSlide.type === 'justification' && (
                 <div className="h-full grid grid-cols-2 gap-12 items-center">
                     <div className="space-y-8">
                        <h3 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                            <Info className="text-primary" size={32} />
                            Justificación
                        </h3>
                        <p className="text-lg text-slate-700 leading-relaxed text-justify border-l-4 border-primary pl-6 italic">
                            "{plan?.justification}"
                        </p>
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h4 className="font-bold text-slate-800 mb-4">Objetivos Estratégicos</h4>
                            <ul className="space-y-3">
                                {plan?.objectives.map((obj, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-600">
                                        <div className="w-2 h-2 rounded-full bg-secondary mt-2.5 shrink-0"></div>
                                        {obj}
                                    </li>
                                ))}
                            </ul>
                        </div>
                     </div>
                     <div className="h-full bg-slate-200 rounded-xl overflow-hidden relative shadow-inner">
                        <img 
                            src={`https://picsum.photos/seed/${topic}business/800/600`} 
                            alt="Business Meeting" 
                            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700 hover:scale-105 transform"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 text-white text-sm">
                            Imagen referencial: Contexto Corporativo
                        </div>
                     </div>
                 </div>
             )}

            {currentSlide.type === 'gantt' && plan && (
                 <div className="h-full flex flex-col">
                    <div className="mb-4 flex justify-between items-end">
                        <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <BarChart3 className="text-primary" />
                            Diagrama de Gantt
                        </h3>
                        <span className="text-sm text-slate-500">Cronograma estimado: {plan.tasks.reduce((acc, t) => Math.max(acc, t.startDay + t.duration), 0)} días</span>
                    </div>
                    <div className="flex-1 min-h-0 border rounded-lg shadow bg-white overflow-hidden">
                        <GanttChart tasks={plan.tasks} />
                    </div>
                 </div>
             )}

            {currentSlide.type === 'excel' && plan && (
                 <div className="h-full flex flex-col">
                     <div className="mb-4 flex justify-between items-end">
                        <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Table2 className="text-green-600" />
                            Detalle Operativo
                        </h3>
                        <span className="text-sm text-slate-500">Vista de Hoja de Cálculo</span>
                    </div>
                    <div className="flex-1 min-h-0">
                        <ExcelView tasks={plan.tasks} startDate={plan.startDate} />
                    </div>
                 </div>
             )}

             {currentSlide.type === 'team' && (
                 <div className="h-full flex flex-col justify-center items-center">
                    <h3 className="text-3xl font-bold text-slate-800 mb-12">Equipo de Proyecto</h3>
                    <div className="flex flex-wrap justify-center gap-8">
                        {plan?.team.map((member, i) => (
                            <div key={i} className="w-64 bg-white p-6 rounded-xl shadow-lg border border-slate-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
                                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-slate-50 shadow-inner">
                                    <img src={`https://picsum.photos/seed/${member.name}/200`} alt={member.name} className="w-full h-full object-cover" />
                                </div>
                                <h4 className="font-bold text-lg text-slate-800">{member.name}</h4>
                                <span className="text-sm text-primary font-medium uppercase tracking-wider">{member.role}</span>
                            </div>
                        ))}
                    </div>
                 </div>
             )}

             {currentSlide.type === 'conclusion' && (
                 <div className="h-full flex flex-col justify-center items-center bg-slate-900 text-white -m-10 p-10">
                     <h2 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">
                         Gracias
                     </h2>
                     <p className="text-xl text-slate-400 max-w-2xl text-center">
                         "El éxito en la gestión de proyectos TI radica en la planificación detallada y la ejecución ágil."
                     </p>
                     <div className="mt-12 pt-12 border-t border-slate-700 w-full max-w-lg flex justify-between text-sm text-slate-500">
                         <span>Generado con Gemini AI</span>
                         <span>{new Date().getFullYear()}</span>
                     </div>
                 </div>
             )}
          </div>

          {/* Slide Footer */}
          <div className="h-8 bg-slate-100 border-t flex items-center justify-between px-8 text-[10px] text-slate-400 uppercase tracking-wider">
              <span>Confidencial</span>
              <span>{topic}</span>
              <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="p-6 flex justify-center gap-4">
        <button 
            onClick={prevSlide} 
            disabled={currentSlideIdx === 0}
            className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-full disabled:opacity-30 transition-all"
        >
            <ChevronLeft />
        </button>
        <button 
            onClick={nextSlide} 
            disabled={currentSlideIdx === SLIDES.length - 1}
            className="bg-primary hover:bg-secondary text-white p-3 rounded-full disabled:opacity-30 transition-all shadow-lg shadow-primary/20"
        >
            <ChevronRight />
        </button>
      </div>
    </div>
  );
}
