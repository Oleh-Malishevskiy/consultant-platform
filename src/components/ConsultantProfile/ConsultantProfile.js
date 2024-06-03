import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import  '../ConsultantProfile/Projile.css';
function ProfileForm({ authUser }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        linkedin: '',
        website: '',
        experience: '',
        services: '',
        successCases: '',
        about: ''
    });
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [profileType, setProfileType] = useState('');

    useEffect(() => {
        if (authUser && authUser.uid) {
            const userRef = doc(db, "users", authUser.uid); 
            getDoc(userRef).then(docSnap => {
                if (docSnap.exists()) {
                    const userRole = docSnap.data().role; 
                    setProfileType(userRole === 'consultant' ? 'consultant_profile' : 'client_profile');

                    const profileRef = doc(db, userRole === 'consultant' ? 'consultant_profile' : 'client_profile', authUser.uid);
                    getDoc(profileRef).then(profileSnap => {
                        if (profileSnap.exists()) {
                            setFormData(profileSnap.data());
                            if (profileSnap.data().imageUrl) {
                                setImageUrl(profileSnap.data().imageUrl);
                            }
                        }
                    });
                }
            });
        }
    }, [authUser]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (event) => {
        if (event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!authUser || !authUser.uid) {
            alert('No authenticated user found. Cannot save profile.');
            return;
        }

        const profileRef = doc(db, profileType, authUser.uid);
        if (image) {
            const imageRef = ref(getStorage(), `${profileType}/${authUser.uid}/${image.name}`);
            try {
                const snapshot = await uploadBytes(imageRef, image);
                const imgUrl = await getDownloadURL(snapshot.ref);
                setImageUrl(imgUrl);
                await setDoc(profileRef, { ...formData, imageUrl: imgUrl }, { merge: true });
                alert('Profile and image updated successfully!');
            } catch (error) {
                console.error("Error uploading image:", error);
                alert('Failed to upload image. See console for details.');
            }
        } else {
            try {
                await setDoc(profileRef, formData, { merge: true });
                alert('Profile updated successfully!');
            } catch (error) {
                console.error("Error updating profile:", error);
                alert('Failed to save profile. See console for details.');
            }
        }
    };

    const handleDelete = async () => {
        if (authUser && authUser.uid) {
            const profileRef = doc(db, profileType, authUser.uid);
            try {
                await deleteDoc(profileRef);
                alert('Profile deleted successfully!');
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    role: '',
                    linkedin: '',
                    website: '',
                    experience: '',
                    services: '',
                    successCases: '',
                    about: ''
                });
                setImageUrl('');
            } catch (error) {
                console.error("Error deleting profile:", error);
                alert('Failed to delete profile. See console for details.');
            }
        }
    };

    return (
        <div>
            <div className='create-card-wrapper'>
            
            <form onSubmit={handleSubmit} >
                <div className="profile-form">
            <h1>Create Dard Form</h1>
                <section>

                <section>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
                <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Role" />
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn Profile" />
                </section>

                <section>
                <input type="text" name="website" value={formData.website} onChange={handleChange} placeholder="Website" />
                <input type="text" name="experience" value={formData.experience} onChange={handleChange} placeholder="Experience" />
                <input type="text" name="services" value={formData.services} onChange={handleChange} placeholder="Services Offered" />
                <input type="text" name="successCases" value={formData.successCases} onChange={handleChange} placeholder="Success Cases" />
                <input type="text" name="about" value={formData.about} onChange={handleChange} placeholder="About" />
                <input type="file" onChange={handleImageChange} />
                </section>

                </section>
                <section>
                <section className='button-section'>
                <button type="submit">Save Profile</button>
                <button type="button" onClick={handleDelete} >Delete Profile</button>
                </section>
                </section>
                </div>
            </form>
            </div>
            
        </div>
    );
}

export default ProfileForm;





