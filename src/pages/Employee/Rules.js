import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../config/api';

const RulesContainer = styled.div`
  background-color: white;
  padding: 2.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
`;

const RuleContent = styled.div`
  white-space: pre-wrap;
  line-height: 1.8;
  color: #334155;
  font-size: 1.05rem;
`;

const LastUpdated = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  font-size: 0.875rem;
  color: #64748b;
  text-align: right;
`;

const Rules = () => {
  const [rules, setRules] = useState(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const { data } = await api.get('/shifts/rules');
      setRules(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center">Company Rules & Regulations</h1>
      <RulesContainer>
        {rules ? (
          <>
            <RuleContent>{rules.content}</RuleContent>
            <LastUpdated>
              Last updated: {new Date(rules.updatedAt).toLocaleDateString()}
            </LastUpdated>
          </>
        ) : (
          <div className="text-center text-gray-500">No rules published yet.</div>
        )}
      </RulesContainer>
    </div>
  );
};

export default Rules;