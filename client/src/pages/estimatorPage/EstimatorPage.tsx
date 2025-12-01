import React, { useEffect } from 'react';
import { PageHeader } from '@/components/common/pageHeader/PageHeader';
import { Button } from '@/components/common/button/Button';
import './EstimatorPage.css';

// Redux Hooks
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setStep,
  toggleService,
  toggleRoomType,
  addRoom,
  removeRoom,
  updateRoomField,
  updatePaintingGlobal,
  updateNestedForm,
  updateContact,
  generateEstimate,
  resetEstimator
} from '@/store/slices/estimatorSlice';

// Components
import { EstimatorStep1 } from '@/components/common/estimator/EstimatorStep1';
import { EstimatorStep2 } from '@/components/common/estimator/EstimatorStep2';
import { EstimatorStep3 } from '@/components/common/estimator/EstimatorStep3';

// Helper Components
const EstimatorProgressBar: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const steps = ['Services', 'Details', 'Contact', 'Estimate'];
  return (
    <div className='estimator-progress-bar'>
      {steps.map((label, index) => {
        const stepNum = index + 1;
        let status = '';
        if (stepNum < currentStep) status = 'completed';
        if (stepNum === currentStep) status = 'active';
        return <div key={label} className={`step-item ${status}`}>{label}</div>;
      })}
    </div>
  );
};

const EstimatorStepContact: React.FC = () => {
  const dispatch = useAppDispatch();
  // We can fetch data here if we want inputs to persist values
  // const contact = useAppSelector(state => state.estimator.formData.contact); 

  return (
    <div className='estimator-step'>
      <h2 className='estimator-title'>Your Information</h2>
      <p className='estimator-subtitle'>
        One last step. Please provide your contact info to see your instant estimate.
      </p>
      <div className='form-group-grid'>
        <div className='form-group'>
          <label htmlFor='name'>Full Name*</label>
          <input
            type='text' id='name' name='name' required
            onChange={(e) => dispatch(updateContact({ field: 'name', value: e.target.value }))}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='email'>Email*</label>
          <input
            type='email' id='email' name='email' required
            onChange={(e) => dispatch(updateContact({ field: 'email', value: e.target.value }))}
          />
        </div>
      </div>
      <div className='form-group'>
        <label htmlFor='phone'>Phone</label>
        <input
          type='tel' id='phone' name='phone'
          onChange={(e) => dispatch(updateContact({ field: 'phone', value: e.target.value }))}
        />
      </div>
      <p className='form-hint'>We'll use this to email you a copy of your estimate.</p>
    </div>
  );
};

// --- Main Page Component ---
const EstimatorPage = () => {
  const dispatch = useAppDispatch();
  
  // Select data from Redux
  const { step, formData, estimate, status, error } = useAppSelector((state) => state.estimator);
  const isLoading = status === 'loading';

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // Navigation Handlers
  const handleNext = () => dispatch(setStep(step + 1));
  const handleBack = () => dispatch(setStep(step - 1));

  // Step 1 Handler
  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof typeof formData.services;
    dispatch(toggleService({ name, checked: e.target.checked }));
  };

  // Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(generateEstimate(formData));
  };

  const isStep1Complete = Object.values(formData.services).some(Boolean);

  return (
    <div className='estimator-page-wrapper'>
      <PageHeader title='Instant Estimator' />
      <div className='estimator-container'>
        <EstimatorProgressBar currentStep={step} />

        <form onSubmit={handleSubmit}>
          {/* --- Step 1 --- */}
          {step === 1 && (
            <>
              <EstimatorStep1
                services={formData.services}
                handleServiceChange={handleServiceChange}
              />
              {isStep1Complete && (
                <div className='estimator-actions'>
                  <Button type='button' variant='primary' onClick={handleNext} className='estimator-submit-btn'>
                    Next: Project Details
                  </Button>
                </div>
              )}
            </>
          )}

          {/* --- Step 2 --- */}
          {step === 2 && (
            <>
              <EstimatorStep2
                formData={formData}
                // We create simple wrappers to dispatch actions
                onNestedChange={(path, field, value) => dispatch(updateNestedForm({ path, field, value }))}
                onPaintingRoomTypeToggle={(type, isChecked) => dispatch(toggleRoomType({ type, isChecked }))}
                onPaintingRoomAdd={(type) => dispatch(addRoom(type))}
                onPaintingRoomRemove={(id) => dispatch(removeRoom(id))}
                onPaintingRoomChange={(roomId, field, value) => dispatch(updateRoomField({ roomId, field, value }))}
                onPaintingGlobalChange={(field, value) => dispatch(updatePaintingGlobal({ field, value }))}
              />
              <div className='estimator-actions space-between'>
                <Button type='button' variant='dark' onClick={handleBack} className='result-back-btn'>
                  Back
                </Button>
                <Button type='button' variant='primary' onClick={handleNext}>
                  Next: Your Info
                </Button>
              </div>
            </>
          )}

          {/* --- Step 3 --- */}
          {step === 3 && (
            <>
              <EstimatorStepContact />
              <div className='estimator-actions space-between'>
                <Button type='button' variant='dark' onClick={handleBack} className='result-back-btn'>
                  Back
                </Button>
                <Button type='submit' variant='primary' disabled={isLoading}>
                  {isLoading ? 'Calculating...' : 'See My Estimate'}
                </Button>
              </div>
            </>
          )}

          {/* --- Step 4 --- */}
          {step === 4 && (
            <EstimatorStep3
              estimation={estimate}
              isLoading={isLoading}
              error={error}
              onBack={() => dispatch(setStep(3))}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default EstimatorPage;