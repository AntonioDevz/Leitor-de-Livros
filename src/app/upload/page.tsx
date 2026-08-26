'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import { processPdf } from '@/lib/pdf-processor';
import { convertToBook } from '@/lib/book-converter';
import { saveBook } from '@/lib/db';
import { formatFileSize } from '@/lib/utils';
import type { Book } from '@/types';

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

      router.push(`/book/${book.id}`);
    } catch (err) {
      console.error(err);
      setError('Não foi possível processar este PDF. Verifique se o arquivo não está corrompido ou protegido.');
      setProcessing(false);
    }
  }, [file, conversionMode, router]);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-24 pb-12">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Novo Livro</h1>
        <p className="text-sm text-slate-500 mb-8">Faça upload de um PDF para transformá-lo em um livro digital.</p>

        {!processing && !file && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-200 ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300 hover:bg-white'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-lg font-medium text-slate-900 mb-2">
              Arraste seu PDF aqui
            </p>
            <p className="text-sm text-slate-500">
              ou clique para selecionar
            </p>
          </div>
        )}

        {file && !processing && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-scale-in">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-900 truncate">{file.name}</h3>
                <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={() => { setFile(null); setError(''); }}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-sm font-medium text-slate-700 mb-3">Modo de conversão</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setConversionMode('reflow')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    conversionMode === 'reflow'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-sm font-medium text-slate-900">Reflow</p>
                  <p className="text-xs text-slate-500 mt-1">Conteúdo responsivo e adaptável</p>
                </button>
                <button
                  onClick={() => setConversionMode('preservation')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    conversionMode === 'preservation'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-sm font-medium text-slate-900">Preservação</p>
                  <p className="text-xs text-slate-500 mt-1">Manter layout visual original</p>
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              onClick={startConversion}
              className="mt-6 w-full py-3.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
            >
              Converter para Livro Digital
            </button>
          </div>
        )}

        {processing && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center animate-scale-in">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Processando seu livro</h3>
            <p className="text-sm text-slate-500 mb-8">{currentStep}...</p>

            <div className="max-w-xs mx-auto">
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((stepIndex + 1) / CONVERSION_STEPS.length) * 100}%` }}
                />
              </div>
              <div className="mt-4 space-y-2">
                {CONVERSION_STEPS.map((step, i) => (
                  <div key={step} className="flex items-center gap-2 text-xs">
                    {i < stepIndex ? (
                      <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : i === stepIndex ? (
                      <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-200" />
                    )}
                    <span className={i <= stepIndex ? 'text-slate-700' : 'text-slate-400'}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && !file && (
          <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
