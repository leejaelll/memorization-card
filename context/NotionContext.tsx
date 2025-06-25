/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createContext, useContext, ReactNode } from 'react';

interface NotionContextType {
  subjectOptions: any[];
  pages: any[];
}

const NotionContext = createContext<NotionContextType | undefined>(undefined);

export function NotionProvider({
  children,
  subjectOptions,
  pages,
}: {
  children: ReactNode;
  subjectOptions: any[];
  pages: any[];
}) {
  return (
    <NotionContext.Provider value={{ subjectOptions, pages }}>
      {children}
    </NotionContext.Provider>
  );
}

export function useNotion() {
  const context = useContext(NotionContext);
  if (context === undefined) {
    throw new Error('useNotion must be used within a NotionProvider');
  }
  return context;
}
