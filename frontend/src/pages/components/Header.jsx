import { useState, useEffect } from 'react';

export default function Header({ onNavigate, currentPage }) {
    const [userData, setUserData] = useState(null);
    
    // Debug logging
    console.log('Header props:', { onNavigate, currentPage });
    
    useEffect(() => {
        const FIXED_USER_ID = '507f1f77bcf86cd799439011';
        
        fetch(`http://127.0.0.1:8080/api/userdata/user/${FIXED_USER_ID}`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            if (data.success && data.data) {
              setUserData(data.data);
            } else {
              throw new Error('Invalid response format');
            }
          })
          .catch(error => {
            console.error('Error fetching user data:', error);
            // Fallback to just show username from profile
            fetch('http://127.0.0.1:8080/api/profile')
              .then(response => response.json())
              .then(profileData => {
                console.log('Profile fallback response:', profileData);
                const firstUser = profileData.data?.[0];
                if (firstUser) {
                  setUserData({ user_id: { username: firstUser.username } });
                }
              })
              .catch(err => console.error('Error fetching profile:', err));
          });
    }, []);


    return (
        <div>
            <nav className="bg-black text-white">
                <div className="flex justify-between items-center space-x-5 px-5">
                    <div className="flex items-center font-bold text-2xl">  
                        <img src="/logo.png" className="h-20"/>
                            Forty Knives and Forks
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => {
                                console.log('Home button clicked');
                                if (onNavigate) {
                                    onNavigate('home');
                                } else {
                                    console.error('onNavigate function not provided');
                                }
                            }}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                currentPage === 'home' 
                                    ? 'bg-white text-black' 
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            Home
                        </button>
                        <button
                            onClick={() => {
                                console.log('Profile button clicked');
                                if (onNavigate) {
                                    onNavigate('profile');
                                } else {
                                    console.error('onNavigate function not provided');
                                }
                            }}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                currentPage === 'profile' 
                                    ? 'bg-white text-black' 
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            Profile
                        </button>
                        <img src="/profile.jpg" className="h-16 rounded-full"/>
                        <div className="pl-5">{userData?.user_id?.username || 'Loading...'}</div>
                    </div>
                </div>
            </nav>
        </div>
    )
}