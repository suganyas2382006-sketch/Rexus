import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Metadata } from 'next';

// 1. Automatically Generate SEO Meta Tags for Search Engines & Social Media
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data: article } = await supabase
    .from('articles')
    .select('title, excerpt, cover_image')
    .eq('slug', params.slug)
    .single();
  
  if (!article) return { title: 'Article Not Found' };

  return {
    title: `${article.title} | Rexus Tech Pulse`,
    description: article.excerpt || `Read ${article.title} on Rexus Tech Pulse.`,
    openGraph: {
      title: article.title,
      images: article.cover_image ? [article.cover_image] : [],
    },
  };
}

// 2. The Main Article Page Component
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  // Fetch the article based on the URL slug
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .single();

  // Show a 404 page if the article doesn't exist in the database
  if (!article) notFound();

  // Increment view count on the server side (Fire and forget)
  // Note: Requires a simple RPC function in Supabase called 'increment_view'
  supabase.rpc('increment_view', { article_id: article.id });

  // Generate dynamic sharing links without needing an external component file
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${article.slug}`;
  const twitterShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <article className="max-w-3xl mx-auto py-12 bg-white p-8 rounded-xl shadow-sm mt-8">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{article.title}</h1>
      
      {/* Metadata & Inline Social Share */}
      <div className="flex items-center justify-between text-gray-500 text-sm mb-8 border-b pb-4">
        <span>{new Date(article.published_at).toLocaleDateString()}</span>
        
        <div className="flex space-x-4 font-semibold">
          <a href={twitterShare} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black transition">
            Share on X
          </a>
          <a href={linkedinShare} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-700 transition">
            LinkedIn
          </a>
        </div>
      </div>

      {/* Optional Cover Image */}
      {article.cover_image && (
        <img 
          src={article.cover_image} 
          alt={article.title} 
          className="w-full h-auto object-cover rounded-lg mb-8 max-h-[400px]" 
        />
      )}

      {/* Markdown Content rendered with Tailwind Typography */}
      <div className="prose prose-lg max-w-none text-gray-800 prose-headings:font-bold prose-a:text-blue-600">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>
    </article>
  );
}
