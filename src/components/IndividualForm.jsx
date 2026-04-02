import React, { useState } from 'react';

const IndividualForm = () => {
  // 1. State for form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: ''
  });

  // 2. State for errors and submission status
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // 3. Validation Logic
  const validate = (name, value) => {
    if (!value.toString().trim()) {
      return "This field is required";
    }
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Enter a valid email (e.g. name@example.com)";
    }
    if (name === 'phone' && !/^[0-9+]{10,15}$/.test(value)) {
      return "Enter a valid phone number";
    }
    return null;
  };

  // 4. Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error as user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // 5. Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      const error = validate(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitted(false);
    } else {
      setErrors({});
      setSubmitted(true);
      console.log("Form Data Submitted:", formData);
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'green' }}>
        <h2>Registration Successful!</h2>
        <p>Thank you for submitting your data.</p>
        <button onClick={() => setSubmitted(false)}>Submit Another</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Individual Registration</h2>
      <form onSubmit={handleSubmit}>
        
        {/* Helper function to render inputs with error handling */}
        {Object.keys(formData).map((key) => (
          <div key={key} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', textTransform: 'capitalize' }}>
              {key.replace(/([A-Z])/g, ' $1')}:
            </label>
            <input
              type={key === 'dob' ? 'date' : 'text'}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                border: errors[key] ? '2px solid red' : '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            {errors[key] && <span style={{ color: 'red', fontSize: '12px' }}>{errors[key]}</span>}
          </div>
        ))}

        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          SUBMIT
        </button>
      </form>
    </div>
  );
};

export default IndividualForm;