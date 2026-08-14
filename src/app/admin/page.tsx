'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  
  // Auth State
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Editor State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes (e.g., login/logout events)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });

    if (error) {
      alert(error.message);
    }
    setIsLoggingIn(false);
  };

  // Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  // Handle Publishing Article
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert('Title and content are required.');
    
    setIsPublishing(true);
    
    // Auto-generate a URL-friendly slug from the title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const { error } = await supabase.from('articles').insert([{ 
      title, 
      slug, 
      content, 
      author_id: session.user.id,
      is_published: true 
    }]);

    setIsPublishing(false);

    if (error) {
      alert('Error publishing: ' + error.message);
    } else {
      alert('Article published successfully!');
      setTitle(''); 
      setContent('');
      router.push(`/${slug}`); // Redirect to the new article
    }
  };

  // View 1: Login Form
  if (!session) {
    return (
      <div className="max-w-md mx-auto mt-24 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Admin Access</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoggingIn}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2.5 rounded-lg transition disabled:opacity-70"
          >
            {isLoggingIn ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    );
  }

  // View 2: Content Editor Dashboard
  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900">Publish Article</h1>
        <button 
          onClick={handleLogout}
          className="text-sm text-red-600 hover:text-red-800 font-medium transition"
        >
          Sign Out
        </button>
      </div>

      <form onSubmit={handlePublish} className="space-y-6 flex flex-col">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Article Title</label>
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="e.g., The Future of AI in 2026" 
            className="w-full border border-gray-300 p-3 rounded-lg text-lg font-medium focus:ring-2 focus:ring-blue-600 outline-none" 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown Format)</label>
          <textarea 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            placeholder="## Introduction&#10;Start writing your post here..." 
            className="w-full border border-gray-300 p-4 rounded-lg h-96 font-mono text-sm focus:ring-2 focus:ring-blue-600 outline-none resize-y" 
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={isPublishing}
          className="bg-gray-900 hover:bg-black text-white p-4 rounded-lg font-bold text-lg transition disabled:opacity-70 shadow-md"
        >
          {isPublishing ? 'Publishing to Platform...' : 'Publish Article Now'}
        </button>
      </form>
    </div>
  );
}
