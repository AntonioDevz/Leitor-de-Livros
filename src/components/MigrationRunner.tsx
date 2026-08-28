'use client';

import { useEffect } from 'react';
import { runPaginationMigration } from '@/lib/migrate-pagination';

export default function MigrationRunner() {
  useEffect(() => {
    runPaginationMigration();
  }, []);
  return null;
}