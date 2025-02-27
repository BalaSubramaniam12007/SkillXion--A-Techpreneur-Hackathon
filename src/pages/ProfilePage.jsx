import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  MapPin,
  Briefcase,
  Calendar,
  Mail,
  Link as LinkIcon,
  Github,
  Linkedin,
  Award,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "../lib/supabase";
import Header from "./Header";
import EditProfileForm from "./EditProfileForm";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await getProfile(user.id);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // If profile doesn't exist for this user yet, create an empty profile
        if (error.code === 'PGRST116') {
          const emptyProfile = {
            id: userId,
            name: "Anonymous",
            type: "unknown",
            bio: "No bio provided",
            location: "Location not specified",
            avatar: "",
            skills: [],
            experience: [],
            education: [],
            certification: [],
            contact: {},
            interests: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setProfile(emptyProfile);
          return;
        } else {
          throw error;
        }
      }

      const formattedProfile = {
        ...data,
        name: data.name || "Anonymous",
        type: data.type || "unknown",
        bio: data.bio || "No bio provided",
        location: data.location || "Location not specified",
        avatar: data.avatar || "",
        skills: Array.isArray(data.skills) ? data.skills.map(skill => ({
          name: skill,
          proficiency: "Advanced"
        })) : [],
        experience: Array.isArray(data.experience) ? data.experience : [],
        education: data.education || [],
        certifications: data.certification || [],
        contact: data.contact || {},
        interests: Array.isArray(data.interests) ? data.interests : [],
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setProfile(formattedProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      setLoading(true);
      setUpdateMessage("Updating profile...");

      let avatarUrl = profile.avatar;
      if (updatedData.avatar && updatedData.avatar.startsWith("data:image")) {
        const avatarFile = await fetch(updatedData.avatar).then((res) => res.blob());
        const fileExt = avatarFile.type.split("/")[1];
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);
        avatarUrl = publicUrl;
      }

      const profileUpdate = {
        id: user.id, // Ensure ID is included
        name: updatedData.name,
        type: updatedData.type,
        bio: updatedData.bio,
        location: updatedData.location,
        avatar: avatarUrl,
        skills: Array.isArray(updatedData.skills) ? updatedData.skills.map(s => s.name) : [],
        experience: updatedData.experience || [], // Now direct JSON
        education: updatedData.education || [],
        certification: updatedData.certification || [],
        contact: updatedData.contact || {},
        interests: Array.isArray(updatedData.interests) ? updatedData.interests : [],
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(profileUpdate)
        .select();

      if (error) throw error;

      await getProfile(user.id);
      setUpdateMessage("Profile updated successfully!");
      setTimeout(() => setUpdateMessage(""), 3000);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setUpdateMessage(`Error: ${error.message}`);
      setTimeout(() => setUpdateMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const UserBadge = ({ type }) => {
    const badgeStyles = {
      entrepreneur: "bg-emerald-100 text-emerald-800 border-emerald-200",
      student: "bg-blue-100 text-blue-800 border-blue-200",
      professional: "bg-purple-100 text-purple-800 border-purple-200",
      unknown: "bg-gray-100 text-gray-800 border-gray-200"
    };

    return (
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Badge variant="outline" className={`px-3 py-1 ${badgeStyles[type] || badgeStyles.unknown}`}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <motion.div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="rounded-full h-12 w-12 border-t-2 border-blue-500"
        />
        <span className="ml-4">Loading profile...</span>
      </motion.div>
    );
  }

  return (
    <motion.div className="min-h-screen bg-gray-50">
      <Header isForDashboard={true} />
      
      <main className="container mx-auto py-8 px-4 max-w-4xl">
        {updateMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 mb-4 rounded-lg ${
              updateMessage.includes("Error") 
                ? "bg-red-100 text-red-700" 
                : "bg-green-100 text-green-700"
            }`}
          >
            {updateMessage}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div key="edit">
              <EditProfileForm
                user={profile}
                onSubmit={handleProfileUpdate}
                onCancel={() => setIsEditing(false)}
              />
            </motion.div>
          ) : (
            <motion.div key="view" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <motion.div className="flex-shrink-0">
                      <img
                        src={profile?.avatar || "https://via.placeholder.com/150"}
                        alt="Profile"
                        className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    </motion.div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold">{profile?.name}</h1>
                        <UserBadge type={profile?.type} />
                      </div>
                      <div className="space-y-2 text-gray-600">
                        <p><MapPin className="inline w-4 h-4 mr-1" /> {profile?.location}</p>
                        <p><Mail className="inline w-4 h-4 mr-1" /> {user?.email}</p>
                        <p>Last updated: {new Date(profile?.updated_at).toLocaleDateString()}</p>
                      </div>
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="mt-4"
                        variant="outline"
                      >
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">About</h2>
                  <p>{profile?.bio}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Experience</h2>
                  {profile?.experience.length > 0 ? (
                    profile.experience.map((exp, idx) => (
                      <div key={idx} className="mb-4">
                        <h3 className="font-medium">{exp.role}</h3>
                        <p>{exp.company} - {exp.years} years</p>
                      </div>
                    ))
                  ) : (
                    <p>No experience listed</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Education</h2>
                  {profile?.education.length > 0 ? (
                    profile.education.map((edu, idx) => (
                      <div key={idx} className="mb-4">
                        <h3 className="font-medium">{edu.degree}</h3>
                        <p>{edu.institution} - {edu.year}</p>
                      </div>
                    ))
                  ) : (
                    <p>No education listed</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Certifications</h2>
                  {profile?.certifications.length > 0 ? (
                    profile.certifications.map((cert, idx) => (
                      <div key={idx} className="mb-4">
                        <h3 className="font-medium">{cert.name}</h3>
                        <p>{cert.issued_by} - {cert.year}</p>
                      </div>
                    ))
                  ) : (
                    <p>No certifications listed</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile?.skills.length > 0 ? (
                      profile.skills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary">{skill.name}</Badge>
                      ))
                    ) : (
                      <p>No skills listed</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Interests</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile?.interests.length > 0 ? (
                      profile.interests.map((interest, idx) => (
                        <Badge key={idx} variant="outline">{interest}</Badge>
                      ))
                    ) : (
                      <p>No interests listed</p>
                  )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Contact</h2>
                  {profile?.contact && Object.keys(profile.contact).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(profile.contact).map(([key, value]) => (
                        <p key={key} className="flex items-center">
                          <span className="font-medium capitalize w-24">{key}:</span> 
                          <span>{value}</span>
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p>No contact information listed</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};

export default ProfilePage;