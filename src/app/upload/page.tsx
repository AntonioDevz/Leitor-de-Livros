'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import SiteFooter from '@/components/ui/SiteFooter';
import { processPdf } from '@/lib/pdf-processor';
import { convertToBook } from '@/lib/book-converter';
import { saveBook } from '@/lib/db';
import { formatFileSize, cn } from '@/lib/utils';
import type { Book } from '@/types';
import { FileText, X, Sparkles, Check, ChevronRight, UploadCloud, ShieldCheck, Zap, Plus } from 'lucide-react';

const CONVERSION_STEPS = [
  'Lendo PDF',
  'Extraindo texto',
  'Extraindo imagens',
  'Identificando capítulos',
  'Detectando títulos',
  'Organizando conteúdo',
  'Criando páginas',
  'Otimizando imagens',
  'Preparando livro digital',
];

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [stepIndex, setStepIndex] = useState(-1);
  const [error, setError] = useState('');
  const [conversionMode, setConversionMode] = useState<'reflow' | 'preservation'>('reflow');

  const handleFile = useCallback((f: File) => {
    if (f.type !== 'application/pdf') {
      setError('Por favor, selecione um arquivo PDF.');
      return;
    }
    if (f.size > 200 * 1024 * 1024) {
      setError('O arquivo é muito grande. Limite de 200MB.');
      return;
    }
    setFile(f);
    setError('');
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const startConversion = useCallback(async () => {
    if (!file) return;
    setProcessing(true);
    setError('');
    setStepIndex(0);
    setCurrentStep(CONVERSION_STEPS[0]);

    try {
      const processed = await processPdf(file, (step, _progress) => {
        const idx = CONVERSION_STEPS.findIndex((s) => s.includes(step.split(' ')[0]));
        if (idx >= 0) {
          setStepIndex(idx);
          setCurrentStep(CONVERSION_STEPS[idx]);
        }
      });

      setStepIndex(4);
      setCurrentStep('Identificando capítulos');

      const book = await convertToBook(
        processed,
        file.name,
        file.size,
        conversionMode,
        (step) => setCurrentStep(step)
      );

      setStepIndex(8);
      setCurrentStep('Preparando livro digital');

      await saveBook(book);

      router.push(`/book/?id=${book.id}`);
    } catch (err) {
      console.error(err);
      setError('Não foi possível processar este PDF. Verifique se o arquivo não está corrompido ou protegido.');
      setProcessing(false);
    }
  }, [file, conversionMode, router]);

  return (
    <main className="min-h-screen bg-[#faf7f1]">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-5 md:px-8 mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#bb7a1c] mb-2">
            Novo livro
          </p>
          <h1 className="font-serif text-4xl font-semibold text-[#221d17] tracking-tight">
            Transforme seu PDF
          </h1>
          <p className="text-[#8b8174] mt-3 leading-relaxed">
            Seu arquivo é processado localmente no navegador — nada é enviado para servidores.
            Tudo fica salvo offline na sua biblioteca.
          </p>
        </div>

        <div className="max-w-2xl mx-auto px-5 md:px-8">
          {!processing && !file && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'relative border-2 border-dashed rounded-3xl p-14 md:p-20 text-center cursor-pointer transition-all duration-300 overflow-hidden bg-[#faf7f1]',
                dragActive
                  ? 'border-[#bb7a1c] bg-[#f6e8cf] scale-[1.01] shadow-lg'
                  : 'border-[#d8ccb9] hover:border-[#bb7a1c]/60 hover:bg-white'
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />

              <div className="relative mx-auto w-20 h-20 rounded-2xl bg-[#f1eadf] border border-[#e6ddd0] flex items-center justify-center mb-8 transition-transform group-hover:scale-105">
                <UploadCloud className="w-9 h-9 text-[#bb7a1c]" strokeWidth={1.5} />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#221d17] flex items-center justify-center">
                  <Plus className="w-3.5 h-3.5 text-[#d9a441]" />
                </span>
              </div>

              <p className="font-serif text-xl font-semibold text-[#221d17] mb-2">
                Arraste seu PDF aqui
              </p>
              <p className="text-sm text-[#8b8174] mb-8">
                ou <span className="text-[#bb7a1c] font-medium underline underline-offset-4">clique para selecionar</span> · até 200MB
              </p>

              <div className="flex items-center justify-center gap-6 text-[11px] text-[#8b8174]">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#bb7a1c]" /> 100% local
                </span>
                <span className="w-1 h-1 rounded-full bg-[#d8ccb9]" />
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#bb7a1c]" /> Rápido
                </span>
                <span className="w-1 h-1 rounded-full bg-[#d8ccb9]" />
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#bb7a1c]" /> Gratuito
                </span>
              </div>
            </div>
          )}

          {file && !processing && (
            <div className="bg-white rounded-3xl border border-[#e6ddd0] p-6 md:p-7 animate-scale-in shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#f3dede] flex items-center justify-center">
                  <FileText className="w-7 h-7 text-[#c24040]" strokeWidth={1.6} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[#221d17] truncate">{file.name}</h3>
                  <p className="text-sm text-[#8b8174]">{formatFileSize(file.size)} · pronto para converter</p>
                </div>
                <button
                  onClick={() => { setFile(null); setError(''); }}
                  className="p-2 rounded-xl hover:bg-[#f1eadf] transition-colors text-[#8b8174] hover:text-[#221d17]"
                  aria-label="Remover arquivo"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-[#f1eadf]">
                <p className="text-sm font-semibold text-[#221d17] mb-4">Modo de conversão</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setConversionMode('reflow')}
                    className={cn(
                      'p-4 rounded-2xl border-2 text-left transition-all duration-200 group relative overflow-hidden',
                      conversionMode === 'reflow'
                        ? 'border-[#bb7a1c] bg-[#f6e8cf]'
                        : 'border-[#e6ddd0] hover:border-[#d8ccb9] hover:bg-[#faf7f1]'
                    )}
                  >
                    {conversionMode === 'reflow' && (
                      <Check className="absolute top-3 right-3 w-4 h-4 text-[#bb7a1c]" strokeWidth={2.5} />
                    )}
                    <p className="text-sm font-semibold text-[#221d17]">Reflow</p>
                    <p className="text-xs text-[#8b8174] mt-1 leading-relaxed">Conteúdo responsivo e adaptável, ideal para leitura no celular</p>
                  </button>
                  <button
                    onClick={() => setConversionMode('preservation')}
                    className={cn(
                      'p-4 rounded-2xl border-2 text-left transition-all duration-200 group relative overflow-hidden',
                      conversionMode === 'preservation'
                        ? 'border-[#bb7a1c] bg-[#f6e8cf]'
                        : 'border-[#e6ddd0] hover:border-[#d8ccb9] hover:bg-[#faf7f1]'
                    )}
                  >
                    {conversionMode === 'preservation' && (
                      <Check className="absolute top-3 right-3 w-4 h-4 text-[#bb7a1c]" strokeWidth={2.5} />
                    )}
                    <p className="text-sm font-semibold text-[#221d17]">Preservação</p>
                    <p className="text-xs text-[#8b8174] mt-1 leading-relaxed">Mantém o layout visual original do documento</p>
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-5 p-4 bg-[#fdf0f0] border border-[#f3d7d7] rounded-2xl text-sm text-[#c24040]">
                  {error}
                </div>
              )}

              <button
                onClick={startConversion}
                className="group mt-6 w-full py-4 bg-[#221d17] text-[#e9dfcd] rounded-full font-medium inline-flex items-center justify-center gap-2 hover:bg-[#3a322a] hover:-translate-y-0.5 transition-all duration-200 shadow-lg"
              >
                Converter para Livro Digital
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          )}

          {processing && (
            <div className="bg-white rounded-3xl border border-[#e6ddd0] p-8 md:p-10 animate-scale-in shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-[#f1eadf] flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 border-[2.5px] border-[#bb7a1c] border-t-transparent rounded-full animate-spin" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#221d17] mb-2 text-center">
                Fazendo a mágica
              </h3>
              <p className="text-sm text-[#8b8174] mb-8 text-center">{currentStep}...</p>

              <div className="max-w-md mx-auto">
                <div className="w-full h-1.5 bg-[#f1eadf] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#bb7a1c] to-[#d9a441] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((stepIndex + 1) / CONVERSION_STEPS.length) * 100}%` }}
                  />
                </div>
                <div className="mt-6 grid gap-y-2 grid-cols-1">
                  {CONVERSION_STEPS.map((step, i) => (
                    <div key={step} className="flex items-center gap-3 text-[13px]">
                      {i < stepIndex ? (
                        <span className="w-5 h-5 rounded-full bg-[#bb7a1c]/15 flex items-center justify-center">
                          <Check className="w-3 h-3 text-[#bb7a1c]" strokeWidth={3} />
                        </span>
                      ) : i === stepIndex ? (
                        <span className="w-5 h-5 border-2 border-[#bb7a1c] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-[#e6ddd0]" />
                      )}
                      <span className={i <= stepIndex ? 'text-[#221d17] font-medium' : 'text-[#8b8174]/60'}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && !file && (
            <div className="mt-4 p-4 bg-[#fdf0f0] border border-[#f3d7d7] rounded-2xl text-sm text-[#c24040]">
              {error}
            </div>
          )}
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}