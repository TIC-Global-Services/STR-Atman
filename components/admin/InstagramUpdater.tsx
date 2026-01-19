"use client";
import { useState } from 'react';
import { getInstagramEmbedUrl, extractInstagramPostId } from '@/utils/instagram';

// This is a simple admin component to help update Instagram posts
// You can use this during development to generate the post data

const InstagramUpdater = () => {
  const [postUrl, setPostUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [likes, setLikes] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const generatePostData = () => {
    if (!postUrl) return;

    const postId = extractInstagramPostId(postUrl);
    const embedUrl = getInstagramEmbedUrl(postUrl);
    
    const postData = {
      id: Date.now(), // Use timestamp as ID
      image: imagePath || "/simbusong1.jpg",
      alt: `STR Instagram Post ${postId}`,
      hasOverlay: true,
      caption: caption || "Latest update from STR",
      likes: likes || "0K",
      postUrl: postUrl,
      embedUrl: embedUrl
    };

    const codeString = `{
  id: ${postData.id},
  image: "${postData.image}",
  alt: "${postData.alt}",
  hasOverlay: true,
  caption: "${postData.caption}",
  likes: "${postData.likes}",
  postUrl: "${postData.postUrl}",
  embedUrl: "${postData.embedUrl}"
}`;

    setGeneratedCode(codeString);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Instagram Post Updater</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Instagram Post URL</label>
          <input
            type="url"
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
            placeholder="https://www.instagram.com/p/DQ1YlwOkSNJ/"
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Post caption..."
            className="w-full p-3 border border-gray-300 rounded-md h-20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Likes Count</label>
          <input
            type="text"
            value={likes}
            onChange={(e) => setLikes(e.target.value)}
            placeholder="125K"
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image Path (in public folder)</label>
          <input
            type="text"
            value={imagePath}
            onChange={(e) => setImagePath(e.target.value)}
            placeholder="/simbusong1.jpg"
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <button
          onClick={generatePostData}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Generate Post Data
        </button>

        {generatedCode && (
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Generated Code (Copy this to InstagramSection.tsx)</label>
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
              {generatedCode}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-md">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Go to <a href="https://www.instagram.com/silambarasantrofficial/" target="_blank" className="text-blue-600 underline">@silambarasantrofficial</a></li>
          <li>Click on a post to open it</li>
          <li>Copy the URL from your browser</li>
          <li>Paste it in the "Instagram Post URL" field above</li>
          <li>Fill in the caption, likes count, and image path</li>
          <li>Click "Generate Post Data"</li>
          <li>Copy the generated code and replace it in the InstagramSection component</li>
        </ol>
      </div>
    </div>
  );
};

export default InstagramUpdater;