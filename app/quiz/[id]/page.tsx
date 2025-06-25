/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function generateStaticParams() {
  const databaseId = process.env.NOTION_DATABASE_ID as string;
  const response = await notion.databases.retrieve({ database_id: databaseId });
  const subjectProperty = response.properties?.['과목'];

  const subjectOptions = subjectProperty?.type === 'select' ? subjectProperty.select?.options ?? [] : [];

  return subjectOptions.map((option: any) => ({ id: option.id }));
}

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div> {id} </div>;
}
