'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';

export default function NativePlatform() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const listener = App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        App.exitApp();
      }
    });

    StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {});

    return () => {
      listener.then((l) => l.remove());
    };
  }, []);

  return null;
}