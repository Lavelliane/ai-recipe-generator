import Layout from '../../components/layout';
import Link from 'next/link';

export default function Dashboard() {
  const recipes = [
    {
      id: 1,
      title: 'Spicy Chicken Sriracha Sandwich',
      tags: ['Chicken', 'Sandwich'],
      image: '/food_img/img1.jpg'
    },
    {
      id: 2,
      title: 'Spicy Chicken Sriracha Sandwich',
      tags: ['Chicken', 'Sandwich'],
      image: '/food_img/img2.jpg'
    }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div className="bg-[#87C792] rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-2">Create your own recipe</h2>
          <p className="text-white/90 mb-6">
            Craft your own unique dish by combining <br /> ingredients, flavors, and steps the way you like it.
          </p>
          {/* <Link 
            href="/generate" 
            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
          >
            <svg 
              className="w-4 h-4 mr-1.5" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" 
                clipRule="evenodd" 
              />
            </svg>
            Generate Recipe
          </Link> */}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">More recipe</h2>
            <Link href="/recipes" className="text-sm text-[#87C792] hover:text-[#6BAF76]">
              view more
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {recipes.map((recipe) => (
              <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="group">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-lg font-medium mb-2">{recipe.title}</h3>
                    <div className="flex gap-2">
                      {recipe.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
} 