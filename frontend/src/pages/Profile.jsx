import { useState, useEffect } from 'react';
import Container from "./components/Container/Container";
import ContainerContent from "./components/Container/ContainerContent";
import ContainerTitle from "./components/Container/ContainerTitle";
import Button from "./components/Button";

export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const FIXED_USER_ID = '507f1f77bcf86cd799439011';

    // Form state
    const [formData, setFormData] = useState({
        preferences: [],
        diet: '',
        goal: '',
        budgetAmount: '',
        timeUnit: 'weekly'
    });

    // Available options
    const dietOptions = ['omnivore', 'vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo'];
    const timeUnitOptions = ['daily', 'weekly', 'monthly'];
    const preferenceOptions = [
        'healthy', 'comfort food', 'quick meals', 'gourmet', 'spicy', 'mild',
        'low-carb', 'high-protein', 'mediterranean', 'asian', 'mexican', 'italian',
        'budget-friendly', 'organic', 'gluten-free', 'dairy-free'
    ];

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://127.0.0.1:8080/api/userdata/user/${FIXED_USER_ID}`);
            const data = await response.json();
            
            if (data.success && data.data) {
                setUserData(data.data);
                setFormData({
                    preferences: data.data.preferences || [],
                    diet: data.data.diet || '',
                    goal: data.data.goal || '',
                    budgetAmount: data.data.budgetAmount?.toString() || '',
                    timeUnit: data.data.timeUnit || 'weekly'
                });
            } else {
                throw new Error(data.message || 'Failed to fetch user data');
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePreferenceToggle = (preference) => {
        setFormData(prev => ({
            ...prev,
            preferences: prev.preferences.includes(preference)
                ? prev.preferences.filter(p => p !== preference)
                : [...prev.preferences, preference]
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError('');
            setSuccess('');

            const updateData = {
                preferences: formData.preferences,
                diet: formData.diet,
                goal: formData.goal,
                budgetAmount: parseFloat(formData.budgetAmount),
                timeUnit: formData.timeUnit
            };

            const response = await fetch(`http://127.0.0.1:8080/api/userdata/${userData._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });

            const result = await response.json();
            
            if (response.ok && result.success) {
                setSuccess('Profile updated successfully!');
                setUserData(result.data);
            } else {
                throw new Error(result.message || 'Failed to update profile');
            }
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading profile...</div>
            </div>
        );
    }

    if (error && !userData) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-gray-600 mt-2">Manage your preferences, goals, and budget</p>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800">{success}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Goals and Preferences Section */}
                <Container>
                    <ContainerTitle>Goals & Preferences</ContainerTitle>
                    <ContainerContent>
                        {/* Goals */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your Goals
                            </label>
                            <textarea
                                name="goal"
                                value={formData.goal}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Describe your food and health goals..."
                            />
                        </div>

                        {/* Diet Preference */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dietary Preference
                            </label>
                            <select
                                name="diet"
                                value={formData.diet}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select a diet</option>
                                {dietOptions.map(diet => (
                                    <option key={diet} value={diet}>
                                        {diet.charAt(0).toUpperCase() + diet.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Food Preferences */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Food Preferences
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {preferenceOptions.map(preference => (
                                    <label key={preference} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.preferences.includes(preference)}
                                            onChange={() => handlePreferenceToggle(preference)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700 capitalize">
                                            {preference.replace('-', ' ')}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </ContainerContent>
                </Container>

                {/* Budget Section */}
                <Container>
                    <ContainerTitle>Budget Settings</ContainerTitle>
                    <ContainerContent>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Budget Amount ($)
                            </label>
                            <input
                                type="number"
                                name="budgetAmount"
                                value={formData.budgetAmount}
                                onChange={handleInputChange}
                                min="0"
                                step="0.01"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your budget"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Budget Period
                            </label>
                            <select
                                name="timeUnit"
                                value={formData.timeUnit}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {timeUnitOptions.map(unit => (
                                    <option key={unit} value={unit}>
                                        {unit.charAt(0).toUpperCase() + unit.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Current Budget Display */}
                        {userData && (
                            <div className="bg-gray-50 p-4 rounded-md">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Current Budget</h3>
                                <p className="text-lg font-semibold text-gray-900">
                                    ${userData.budgetAmount?.toFixed(2)} per {userData.timeUnit}
                                </p>
                            </div>
                        )}
                    </ContainerContent>
                </Container>
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    );
}
