import React from 'react';
import { Button } from '@/components/ui/button';

export default function Delete() {
  // Commented out for future implementation
  // const [email, setEmail] = useState('');
  // const [isLoading, setIsLoading] = useState(false);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   // TODO: Implement account deletion logic with Supabase
  //   setIsLoading(false);
  // };

  return (
    <main className="flex-grow bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6 text-red-600">Delete Account</h1>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">This action cannot be undone. Please be certain.</p>
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
              <p className="text-sm text-red-800">
                Authentication required. This feature will be available soon.
              </p>
            </div>
          </div>

          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your email"
                disabled
              />
            </div>

            <Button type="submit" variant="destructive" className="w-full" disabled>
              Delete Account
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
