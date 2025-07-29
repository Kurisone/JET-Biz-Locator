import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createBusiness } from '../../redux/businesses';
import './AddBusinessForm.css';

const AddBusinessForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.session.user);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'USA',
    phone: '',
    website: '',
    email: '',
    price_range: 1,
    hours_monday: '',
    hours_tuesday: '',
    hours_wednesday: '',
    hours_thursday: '',
    hours_friday: '',
    hours_saturday: '',
    hours_sunday: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Business name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zip_code.trim()) newErrors.zip_code = 'ZIP code is required';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Current user from Redux:', user); // added for debug

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const newBusiness = await dispatch(createBusiness(formData));
      navigate(`/businesses/${newBusiness.id}`);
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to create business' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-business-page">
      <div className="add-business-header">
        <h1>Add a New Business</h1>
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to All Businesses
        </button>
      </div>

      <div className="add-business-container">
        <form onSubmit={handleSubmit} className="add-business-form">
          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}

          <div className="form-section">
            <h3>Basic Information</h3>

            <div className="form-group">
              <label htmlFor="name">Business Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="field-error">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="price_range">Price Range</label>
              <select
                id="price_range"
                name="price_range"
                value={formData.price_range}
                onChange={handleChange}
              >
                <option value={1}>$ - Inexpensive</option>
                <option value={2}>$$ - Moderate</option>
                <option value={3}>$$$ - Expensive</option>
                <option value={4}>$$$$ - Very Expensive</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Location</h3>

            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <span className="field-error">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? 'error' : ''}
                />
                {errors.city && <span className="field-error">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="state">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={errors.state ? 'error' : ''}
                />
                {errors.state && <span className="field-error">{errors.state}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="zip_code">ZIP Code *</label>
                <input
                  type="text"
                  id="zip_code"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  className={errors.zip_code ? 'error' : ''}
                />
                {errors.zip_code && <span className="field-error">{errors.zip_code}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Contact Information</h3>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="website">Website</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Business Hours</h3>
            <p className="section-description">Leave blank if closed on any day</p>

            <div className="hours-grid">
              <div className="form-group">
                <label htmlFor="hours_monday">Monday</label>
                <input
                  type="text"
                  id="hours_monday"
                  name="hours_monday"
                  value={formData.hours_monday}
                  onChange={handleChange}
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                />
              </div>

              <div className="form-group">
                <label htmlFor="hours_tuesday">Tuesday</label>
                <input
                  type="text"
                  id="hours_tuesday"
                  name="hours_tuesday"
                  value={formData.hours_tuesday}
                  onChange={handleChange}
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                />
              </div>

              <div className="form-group">
                <label htmlFor="hours_wednesday">Wednesday</label>
                <input
                  type="text"
                  id="hours_wednesday"
                  name="hours_wednesday"
                  value={formData.hours_wednesday}
                  onChange={handleChange}
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                />
              </div>

              <div className="form-group">
                <label htmlFor="hours_thursday">Thursday</label>
                <input
                  type="text"
                  id="hours_thursday"
                  name="hours_thursday"
                  value={formData.hours_thursday}
                  onChange={handleChange}
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                />
              </div>

              <div className="form-group">
                <label htmlFor="hours_friday">Friday</label>
                <input
                  type="text"
                  id="hours_friday"
                  name="hours_friday"
                  value={formData.hours_friday}
                  onChange={handleChange}
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                />
              </div>

              <div className="form-group">
                <label htmlFor="hours_saturday">Saturday</label>
                <input
                  type="text"
                  id="hours_saturday"
                  name="hours_saturday"
                  value={formData.hours_saturday}
                  onChange={handleChange}
                  placeholder="e.g., 10:00 AM - 6:00 PM"
                />
              </div>

              <div className="form-group">
                <label htmlFor="hours_sunday">Sunday</label>
                <input
                  type="text"
                  id="hours_sunday"
                  name="hours_sunday"
                  value={formData.hours_sunday}
                  onChange={handleChange}
                  placeholder="e.g., Closed"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? 'Creating...' : 'Create Business'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBusinessForm;
