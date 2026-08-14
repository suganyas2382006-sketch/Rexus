import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function Home() {
  // Fetch Latest Articles
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(10);

  return (
    <div>
      <section className="py-20 text-center">
        <h1 className="text-5xl font-extrabold mb-4">Technology • AI • Data</h1>
        <p className="text-xl text-gray-600">Insights for developers and tech enthusiasts.</p>
      </section>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles?.map((article) => (
          <Link href={`/${article.slug}`} key={article.id} className="block bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold mb-2">{article.title}</h2>
            <p className="text-sm text-gray-500">{new Date(article.published_at).toLocaleDateString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
