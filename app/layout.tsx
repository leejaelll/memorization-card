import type { Metadata } from 'next';
import { Black_Han_Sans, Hahmlet } from 'next/font/google';
import './globals.css';
import { Client } from '@notionhq/client';
import { NotionProvider } from '../context/NotionContext';

const blackHanSans = Black_Han_Sans({
  variable: '--font-black-han-sans',
  subsets: ['latin'],
  weight: ['400'],
});

const hahmlet = Hahmlet({
  variable: '--font-hahmlet',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '🐶 복습하자!',
  description: '🐶 복습하자!',
};

const notion = new Client({ auth: process.env.NOTION_API_KEY });
console.log('🥕 notion', notion);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const databaseId = process.env.NOTION_DATABASE_ID as string;
  const response = await notion.databases.retrieve({ database_id: databaseId });
  const queryResponse = await notion.databases.query({ database_id: databaseId });
  // 필요한 데이터만 추출
  const subjectProperty = response.properties?.['과목'];

  const subjectOptions = subjectProperty?.type === 'select' ? subjectProperty.select?.options ?? [] : [];

  // queryResponse에서 필요한 데이터만 추출
  const pages = queryResponse.results || [];

  // console.log('🥕 queryResponse', queryResponse);

  return (
    <html lang='en'>
      <body className={`${blackHanSans.variable} ${hahmlet.variable} antialiased`}>
        <NotionProvider subjectOptions={subjectOptions} pages={pages}>
          {children}
        </NotionProvider>
      </body>
    </html>
  );
}
