'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name } from '@coinbase/onchainkit/identity';
import { User, Wallet as WalletIcon, FileText, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { walletService } from '@/lib/wallet';

interface CreatorFormData {
  name: string;
  bio: string;
  content: string;
  gatedContent?: {
    title: string;
    description: string;
    secretContent: string;
    minTipAmount: string;
  };
}

export default function CreatorOnboardingPage() {
  const router = useRouter();
  const { setFrameReady } = useMiniKit();
  const [currentStep, setCurrentStep] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreatorFormData>({
    name: '',
    bio: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFrameReady();
    checkWalletConnection();
  }, [setFrameReady]);

  const checkWalletConnection = async () => {
    try {
      const connected = await walletService.isConnected();
      const address = await walletService.getCurrentAddress();
      setIsConnected(connected);
      setWalletAddress(address);
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const handleInputChange = (field: keyof CreatorFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGatedContentChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      gatedContent: {
        ...prev.gatedContent,
        title: prev.gatedContent?.title || '',
        description: prev.gatedContent?.description || '',
        secretContent: prev.gatedContent?.secretContent || '',
        minTipAmount: prev.gatedContent?.minTipAmount || '0.01',
        [field]: value
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create creator profile
      const creatorResponse = await fetch('/api/creators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creatorId: walletAddress, // Using wallet address as creator ID for demo
          walletAddress,
          name: formData.name,
          bio: formData.bio,
          content: formData.content,
        }),
      });

      const creatorData = await creatorResponse.json();

      if (!creatorData.success) {
        throw new Error(creatorData.error || 'Failed to create creator profile');
      }

      // Create gated content if provided
      if (formData.gatedContent && formData.gatedContent.title) {
        const contentResponse = await fetch('/api/gated-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            creatorId: walletAddress,
            title: formData.gatedContent.title,
            description: formData.gatedContent.description,
            secretContent: formData.gatedContent.secretContent,
            minTipAmount: formData.gatedContent.minTipAmount,
          }),
        });

        const contentData = await contentResponse.json();

        if (!contentData.success) {
          console.warn('Failed to create gated content:', contentData.error);
        }
      }

      // Redirect to creator dashboard
      router.push(`/creator/${walletAddress}`);

    } catch (error) {
      console.error('Error creating creator profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to create profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToStep = (step: number) => {
    switch (step) {
      case 2:
        return isConnected && walletAddress;
      case 3:
        return formData.name && formData.bio && formData.content;
      case 4:
        return true; // Gated content is optional
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      {/* Header */}
      <header className="p-4 border-b border-white border-opacity-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Creator Setup</h1>
              <p className="text-sm text-gray-400">Step {currentStep} of 4</p>
            </div>
          </div>
          
          <Wallet>
            <ConnectWallet>
              <Name />
            </ConnectWallet>
          </Wallet>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-600 text-gray-400'
              }`}>
                {step < currentStep ? <CheckCircle size={16} /> : step}
              </div>
              {step < 4 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < currentStep ? 'bg-purple-500' : 'bg-gray-600'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-4">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-lg p-6">
          
          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Welcome to TipJarz</h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Start monetizing your content with direct tips from your audience. 
                Set up your creator profile and begin earning from your community today.
              </p>
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3 p-3 bg-white bg-opacity-5 rounded-lg">
                  <WalletIcon size={20} className="text-purple-400" />
                  <div>
                    <div className="text-white font-medium">Direct Tips</div>
                    <div className="text-gray-400 text-sm">Receive ETH tips directly to your wallet</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white bg-opacity-5 rounded-lg">
                  <Lock size={20} className="text-purple-400" />
                  <div>
                    <div className="text-white font-medium">Gated Content</div>
                    <div className="text-gray-400 text-sm">Unlock exclusive content with tips</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white bg-opacity-5 rounded-lg">
                  <FileText size={20} className="text-purple-400" />
                  <div>
                    <div className="text-white font-medium">Social Proof</div>
                    <div className="text-gray-400 text-sm">Build community with public tip history</div>
                  </div>
                </div>
              </div>
              <button
                onClick={nextStep}
                className="mt-8 btn-primary flex items-center gap-2 mx-auto"
              >
                Get Started
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* Step 2: Wallet Connection */}
          {currentStep === 2 && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                <WalletIcon size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
              <p className="text-gray-300 mb-8">
                Connect your Base wallet to receive tips and manage your creator profile.
              </p>
              
              {isConnected && walletAddress ? (
                <div className="bg-green-500 bg-opacity-10 border border-green-400 border-opacity-30 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle size={20} className="text-green-400" />
                    <span className="text-green-200 font-medium">Wallet Connected</span>
                  </div>
                  <div className="text-green-300 text-sm font-mono">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-500 bg-opacity-10 border border-yellow-400 border-opacity-30 rounded-lg p-4 mb-6">
                  <div className="text-yellow-200 font-medium mb-2">Wallet Not Connected</div>
                  <div className="text-yellow-300 text-sm">
                    Please connect your wallet using the button in the top right corner.
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <button
                  onClick={prevStep}
                  className="btn-secondary"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!canProceedToStep(2)}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Profile Setup */}
          {currentStep === 3 && (
            <div>
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Create Your Profile</h2>
                <p className="text-gray-300">
                  Tell your audience about yourself and your content.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your creator name"
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Bio *
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell your audience about yourself..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Latest Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Share your latest post or content..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-center mt-8">
                <button
                  onClick={prevStep}
                  className="btn-secondary"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!canProceedToStep(3)}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Gated Content (Optional) */}
          {currentStep === 4 && (
            <div>
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <Lock size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Gated Content</h2>
                <p className="text-gray-300">
                  Create exclusive content that unlocks after tips (optional).
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Content Title
                  </label>
                  <input
                    type="text"
                    value={formData.gatedContent?.title || ''}
                    onChange={(e) => handleGatedContentChange('title', e.target.value)}
                    placeholder="e.g., Exclusive Building Guide"
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.gatedContent?.description || ''}
                    onChange={(e) => handleGatedContentChange('description', e.target.value)}
                    placeholder="Describe what users will get..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Secret Content
                  </label>
                  <textarea
                    value={formData.gatedContent?.secretContent || ''}
                    onChange={(e) => handleGatedContentChange('secretContent', e.target.value)}
                    placeholder="The exclusive content that will be unlocked..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Minimum Tip Amount (ETH)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    value={formData.gatedContent?.minTipAmount || '0.01'}
                    onChange={(e) => handleGatedContentChange('minTipAmount', e.target.value)}
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-6 bg-red-500 bg-opacity-10 border border-red-400 border-opacity-30 rounded-lg p-4">
                  <div className="text-red-200 text-sm">{error}</div>
                </div>
              )}

              <div className="flex gap-4 justify-center mt-8">
                <button
                  onClick={prevStep}
                  className="btn-secondary"
                  disabled={isSubmitting}
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <CheckCircle size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
