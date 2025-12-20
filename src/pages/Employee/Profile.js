import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
`;

const IDCard = styled.div`
  background: white;
  width: 350px;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  position: relative;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  height: 100px;
  position: relative;
`;

const AvatarContainer = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: white;
  padding: 4px;
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background-color: #e2e8f0;
`;

const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #e0e7ff;
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
`;

const Content = styled.div`
  padding: 4rem 2rem 2rem;
  text-align: center;
`;

const Name = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const Designation = styled.div`
  color: #64748b;
  font-weight: 500;
  margin-bottom: 1.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  text-align: left;
  background-color: #f8fafc;
  padding: 1.5rem;
  border-radius: 0.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const Label = styled.span`
  color: #64748b;
  font-size: 0.875rem;
`;

const Value = styled.span`
  color: #1e293b;
  font-weight: 500;
  font-size: 0.875rem;
`;

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <ProfileContainer>
      <IDCard>
        <Header>
          <AvatarContainer>
            {user.profilePhoto ? (
              <Avatar src={user.profilePhoto} alt={user.name} />
            ) : (
              <AvatarPlaceholder>
                {user.name.charAt(0)}
              </AvatarPlaceholder>
            )}
          </AvatarContainer>
        </Header>
        <Content>
          <Name>{user.name}</Name>
          <Designation>{user.designation}</Designation>
          
          <InfoGrid>
            <InfoItem>
              <Label>Employee ID</Label>
              <Value>{user.employeeId}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Department</Label>
              <Value>{user.department}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Email</Label>
              <Value>{user.email}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Mobile</Label>
              <Value>{user.mobile}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Joined</Label>
              <Value>{new Date(user.joiningDate).toLocaleDateString()}</Value>
            </InfoItem>
          </InfoGrid>
        </Content>
      </IDCard>
    </ProfileContainer>
  );
};

export default Profile;