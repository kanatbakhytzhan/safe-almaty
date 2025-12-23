'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  UserCircle2,
  LogOut,
  Droplet,
  AlertCircle,
  Heart,
  Phone,
  Plus,
  X,
  History,
  MapPin,
  Shield,
  Bell,
  Wind,
  Edit2,
  Save,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: string;
  phoneNumber: string | null;
  bloodType: string | null;
  allergies: string | null;
  chronicConditions: string | null;
  emergencyContacts: EmergencyContact[];
  earthquakeAlerts: boolean;
  airPollutionWarnings: boolean;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('Session debug - Profile page:', {
      status,
      hasSession: !!session,
      email: session?.user?.email,
      userId: (session?.user as any)?.id,
    });
  }, [session, status]);

  // Clear corrupted session cookies if we detect JWT errors
  useEffect(() => {
    if (status === 'unauthenticated') {
      // Clear any potentially corrupted NextAuth cookies
      document.cookie.split(';').forEach((c) => {
        const cookieName = c.trim().split('=')[0];
        if (cookieName.startsWith('next-auth') || cookieName.startsWith('__Secure-next-auth')) {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
    }
  }, [status]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    bloodType: '',
    allergies: '',
    chronicConditions: '',
    emergencyContacts: [] as EmergencyContact[],
    earthquakeAlerts: true,
    airPollutionWarnings: true,
  });

  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [showAddContact, setShowAddContact] = useState(false);

  useEffect(() => {
    console.log('Session debug - Profile useEffect:', {
      status,
      hasSession: !!session,
      email: session?.user?.email,
    });

    // Handle unauthenticated users - redirect immediately
    if (status === 'unauthenticated') {
      console.log('Session debug - Redirecting to login (unauthenticated)');
      router.push('/login');
      return;
    }

    // Only fetch profile when authenticated
    if (status === 'authenticated' && session) {
      console.log('Session debug - Fetching profile (authenticated)');
      fetchProfile();
    }
  }, [status, session, router]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/profile');
      
      // Handle 401 Unauthorized - redirect to login
      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Session expired, redirecting to login:', errorData.error);
        // Clear any corrupted session by signing out
        await signOut({ redirect: false });
        router.push('/login');
        return;
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch profile: ${response.status}`);
      }
      
      const data = await response.json();
      setProfile(data);
      setFormData({
        name: data.name || '',
        phoneNumber: data.phoneNumber || '',
        bloodType: data.bloodType || '',
        allergies: data.allergies || '',
        chronicConditions: data.chronicConditions || '',
        emergencyContacts: data.emergencyContacts || [],
        earthquakeAlerts: data.earthquakeAlerts ?? true,
        airPollutionWarnings: data.airPollutionWarnings ?? true,
      });
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      // Only show alert for non-auth errors
      if (!error.message.includes('401') && !error.message.includes('Not authenticated') && !error.message.includes('Session expired')) {
        alert(`Failed to load profile: ${error.message}`);
      } else {
        // For auth errors, redirect to login
        await signOut({ redirect: false });
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('Saving profile data:', formData);
      
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('Profile update response status:', response.status);

      // Handle 401 Unauthorized - redirect to login
      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Unauthorized, redirecting to login:', errorData.error);
        await signOut({ redirect: false });
        router.push('/login');
        return;
      }

      if (!response.ok) {
        let errorMessage = 'Failed to update profile';
        try {
          // Clone the response to read it without consuming the original
          const responseClone = response.clone();
          
          // Check if response has content
          const contentType = response.headers.get('content-type');
          console.log('Error response headers:', {
            status: response.status,
            statusText: response.statusText,
            contentType,
          });
          
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            console.error('Profile update error response (JSON):', {
              errorData,
              keys: Object.keys(errorData),
              stringified: JSON.stringify(errorData),
            });
            
            // Extract error message from various possible locations
            if (errorData.error) {
              errorMessage = errorData.error;
            } else if (errorData.details) {
              if (typeof errorData.details === 'string') {
                errorMessage = errorData.details;
              } else if (errorData.details.message) {
                errorMessage = errorData.details.message;
              } else {
                errorMessage = JSON.stringify(errorData.details);
              }
            } else if (errorData.message) {
              errorMessage = errorData.message;
            } else if (Object.keys(errorData).length > 0) {
              // If object has keys but no error/message, stringify it
              errorMessage = `Error: ${JSON.stringify(errorData)}`;
            } else {
              errorMessage = `Failed to update profile (Status: ${response.status})`;
            }
          } else {
            // Try to get text response
            const textResponse = await responseClone.text();
            console.error('Profile update error (text):', textResponse);
            if (textResponse && textResponse.trim()) {
              try {
                const parsed = JSON.parse(textResponse);
                errorMessage = parsed.error || parsed.details?.message || parsed.message || textResponse;
              } catch {
                errorMessage = textResponse || errorMessage;
              }
            } else {
              errorMessage = `Failed to update profile (Status: ${response.status} ${response.statusText || 'Unknown error'})`;
            }
          }
        } catch (parseError: any) {
          console.error('Failed to parse error response:', parseError);
          errorMessage = `Failed to update profile (Status: ${response.status} ${response.statusText || 'Unknown error'})`;
        }
        throw new Error(errorMessage);
      }

      const updatedData = await response.json();
      console.log('Profile updated successfully:', updatedData);
      setProfile(updatedData);
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      // Show the actual error message to the user
      const errorMessage = error.message || 'Failed to update profile. Please try again.';
      
      // Only show alert for non-auth errors
      if (!errorMessage.includes('401') && 
          !errorMessage.includes('Not authenticated') && 
          !errorMessage.includes('Session expired')) {
        alert(errorMessage);
      } else {
        // For auth errors, redirect to login
        await signOut({ redirect: false });
        router.push('/login');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      const contact: EmergencyContact = {
        id: `contact_${Date.now()}`,
        name: newContact.name,
        phone: newContact.phone,
      };
      setFormData({
        ...formData,
        emergencyContacts: [...formData.emergencyContacts, contact],
      });
      setNewContact({ name: '', phone: '' });
      setShowAddContact(false);
    }
  };

  const handleRemoveContact = (id: string) => {
    setFormData({
      ...formData,
      emergencyContacts: formData.emergencyContacts.filter((c) => c.id !== id),
    });
  };

  const getUserLevel = (role: string) => {
    const levels: Record<string, string> = {
      TOURIST: 'Safe Traveler',
      RESIDENT: 'Local Guardian',
      ADMIN: 'Safety Administrator',
    };
    return levels[role] || 'User';
  };

  // Show loading spinner while session is loading or profile is being fetched
  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // If unauthenticated, the useEffect will redirect, but show nothing while redirecting
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
            <p className="text-slate-600">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated but no profile yet, show loading
  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 mb-6"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-slate-600 flex items-center justify-center">
                  <UserCircle2 className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-1">
                    {profile.name || 'User'}
                  </h1>
                  <p className="text-slate-600 mb-1">{profile.email}</p>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {getUserLevel(profile.role)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Emergency Medical Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Heart className="w-6 h-6 text-red-600" />
                  <h2 className="text-xl font-bold text-slate-900">Emergency Medical Card</h2>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Blood Type */}
                <div>
                  <label className="text-sm font-semibold text-slate-600 mb-1 block flex items-center space-x-2">
                    <Droplet className="w-4 h-4" />
                    <span>Blood Type</span>
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.bloodType}
                      onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                    >
                      <option value="">Select blood type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <p className="text-slate-900 font-medium">
                      {profile.bloodType || 'Not specified'}
                    </p>
                  )}
                </div>

                {/* Allergies */}
                <div>
                  <label className="text-sm font-semibold text-slate-600 mb-1 block flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Allergies</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                      placeholder="e.g., Penicillin, Peanuts"
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                    />
                  ) : (
                    <p className="text-slate-900 font-medium">
                      {profile.allergies || 'None reported'}
                    </p>
                  )}
                </div>

                {/* Chronic Conditions */}
                <div>
                  <label className="text-sm font-semibold text-slate-600 mb-1 block flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>Chronic Conditions</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.chronicConditions}
                      onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                      placeholder="e.g., Diabetes, Asthma"
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                    />
                  ) : (
                    <p className="text-slate-900 font-medium">
                      {profile.chronicConditions || 'None reported'}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        fetchProfile(); // Reset form data
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Trusted Contacts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Phone className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-900">Trusted Contacts</h2>
                </div>
                {isEditing && (
                  <button
                    onClick={() => setShowAddContact(true)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                )}
              </div>

              {showAddContact && (
                <div className="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <input
                    type="text"
                    placeholder="Contact Name"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddContact}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium"
                    >
                      Add Contact
                    </button>
                    <button
                      onClick={() => {
                        setShowAddContact(false);
                        setNewContact({ name: '', phone: '' });
                      }}
                      className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {formData.emergencyContacts.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">
                    No emergency contacts added yet
                  </p>
                ) : (
                  formData.emergencyContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{contact.name}</p>
                        <p className="text-sm text-slate-600">{contact.phone}</p>
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveContact(contact.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center space-x-1"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Contacts</span>
                </button>
              )}
            </motion.div>

            {/* Activity & Safety History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
                <History className="w-6 h-6 text-slate-700" />
                <span>Activity & Safety History</span>
              </h2>

              <div className="space-y-4">
                {/* SOS History */}
                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <h3 className="font-semibold text-slate-900">SOS History</h3>
                  </div>
                  <p className="text-slate-700 text-sm">
                    No incidents reported - Stay safe!
                  </p>
                </div>

                {/* Places Visited */}
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-900">Places Visited</h3>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">0</p>
                  <p className="text-slate-600 text-sm">locations saved</p>
                </div>

                {/* Safety Contributions */}
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-slate-900">Safety Contributions</h3>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">0</p>
                  <p className="text-slate-600 text-sm">reports submitted</p>
                </div>
              </div>
            </motion.div>

            {/* Safety Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
                <Bell className="w-6 h-6 text-slate-700" />
                <span>Safety Preferences</span>
              </h2>

              <div className="space-y-4">
                {/* Earthquake Alerts */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Earthquake Alerts</p>
                      <p className="text-sm text-slate-600">Get notified about seismic activity</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.earthquakeAlerts}
                      onChange={(e) => {
                        setFormData({ ...formData, earthquakeAlerts: e.target.checked });
                        if (!isEditing) setIsEditing(true);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Air Pollution Warnings */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center space-x-3">
                    <Wind className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Air Pollution Warnings</p>
                      <p className="text-sm text-slate-600">Alerts for high AQI levels</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.airPollutionWarnings}
                      onChange={(e) => {
                        setFormData({ ...formData, airPollutionWarnings: e.target.checked });
                        if (!isEditing) setIsEditing(true);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {isEditing && (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Preferences'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

