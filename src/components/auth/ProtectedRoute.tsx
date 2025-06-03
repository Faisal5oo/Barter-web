import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import AuthModal from './AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  showModal?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/',
  showModal = true 
}) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      if (showModal) {
        setShowAuthModal(true);
      } else {
        navigate(redirectTo);
      }
    }
  }, [isAuthenticated, navigate, redirectTo, showModal]);

  const handleModalClose = () => {
    setShowAuthModal(false);
    navigate(redirectTo);
  };

  if (!isAuthenticated) {
    return (
      <>
        {showModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={handleModalClose}
            title="Authentication Required"
            description="Please login or create an account to access this page"
            defaultTab="login"
          />
        )}
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute; 