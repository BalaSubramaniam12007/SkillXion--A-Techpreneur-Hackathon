import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { UserIcon, Upload, Plus, X } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EditProfileForm = ({ user, onSubmit, onCancel }) => {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: user?.name || "",
      type: user?.type || "entrepreneur",
      bio: user?.bio || "",
      location: user?.location || "",
      skills: user?.skills || [],
      experience: user?.experience || [],
      education: user?.education || [],
      certification: user?.certifications || [],
      contact: user?.contact || {},
      interests: user?.interests || []
    }
  });

  const { control, handleSubmit, setValue, getValues } = form;

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = (fieldName) => {
    const currentItems = getValues(fieldName);
    const newItem = 
      fieldName === "skills" ? { name: "" } :
      fieldName === "experience" ? { company: "", role: "", years: "" } :
      fieldName === "education" ? { degree: "", institution: "", year: "" } :
      fieldName === "certification" ? { name: "", issued_by: "", year: "" } :
      fieldName === "interests" ? "" : {};
    setValue(fieldName, [...currentItems, newItem]);
  };

  const removeItem = (fieldName, index) => {
    const currentItems = getValues(fieldName);
    setValue(fieldName, currentItems.filter((_, i) => i !== index));
  };

  const onFormSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const updatedData = {
        ...data,
        avatar: avatarPreview || user?.avatar,
        skills: data.skills.filter(skill => skill.name),
        experience: data.experience.filter(exp => exp.company && exp.role),
        education: data.education.filter(edu => edu.degree && edu.institution),
        certification: data.certification.filter(cert => cert.name && cert.issued_by),
        interests: data.interests.filter(interest => interest),
        contact: data.contact
      };
      await onSubmit(updatedData);
    } catch (error) {
      console.error("Error in form submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <CardContent className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center md:items-start md:flex-row gap-6">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full flex items-center justify-center bg-blue-100 border-4 border-gray-100 overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Profile preview" className="h-full w-full object-cover" />
                  ) : user?.avatar ? (
                    <img src={user.avatar} alt="Current profile" className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon className="h-20 w-20 text-blue-500" />
                  )}
                </div>
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                >
                  <Upload className="h-8 w-8 text-white" />
                </label>
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  className="hidden" 
                />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Profile Photo</h3>
                <p className="text-sm text-gray-500 mb-2">Upload a clear photo</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('avatar-upload').click()}
                >
                  Upload New Photo
                </Button>
              </div>
            </div>

            <FormField control={control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={control} name="type" render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select your profile type" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={control} name="location" render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl><Input placeholder="City, Country" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={control} name="bio" render={({ field }) => (
              <FormItem>
                <FormLabel>About Me</FormLabel>
                <FormControl><Textarea placeholder="Share a brief description about yourself" className="resize-none h-32" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div>
              <FormLabel>Skills</FormLabel>
              <Controller control={control} name="skills" render={({ field }) => (
                <div className="space-y-2">
                  {field.value.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="Skill name"
                        value={skill.name}
                        onChange={(e) => {
                          const newSkills = [...field.value];
                          newSkills[index].name = e.target.value;
                          setValue("skills", newSkills);
                        }}
                      />
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeItem("skills", index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addItem("skills")}>
                    <Plus className="h-4 w-4 mr-2" /> Add Skill
                  </Button>
                </div>
              )} />
            </div>

            <div>
              <FormLabel>Experience</FormLabel>
              <Controller control={control} name="experience" render={({ field }) => (
                <div className="space-y-4">
                  {field.value.map((exp, index) => (
                    <div key={index} className="space-y-2 border p-4 rounded">
                      <Input
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => {
                          const newExp = [...field.value];
                          newExp[index].company = e.target.value;
                          setValue("experience", newExp);
                        }}
                      />
                      <Input
                        placeholder="Role"
                        value={exp.role}
                        onChange={(e) => {
                          const newExp = [...field.value];
                          newExp[index].role = e.target.value;
                          setValue("experience", newExp);
                        }}
                      />
                      <Input
                        placeholder="Years"
                        value={exp.years}
                        onChange={(e) => {
                          const newExp = [...field.value];
                          newExp[index].years = e.target.value;
                          setValue("experience", newExp);
                        }}
                      />
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeItem("experience", index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addItem("experience")}>
                    <Plus className="h-4 w-4 mr-2" /> Add Experience
                  </Button>
                </div>
              )} />
            </div>

            <div>
              <FormLabel>Education</FormLabel>
              <Controller control={control} name="education" render={({ field }) => (
                <div className="space-y-4">
                  {field.value.map((edu, index) => (
                    <div key={index} className="space-y-2 border p-4 rounded">
                      <Input
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEdu = [...field.value];
                          newEdu[index].degree = e.target.value;
                          setValue("education", newEdu);
                        }}
                      />
                      <Input
                        placeholder="Institution"
                        value={edu.institution}
                        onChange={(e) => {
                          const newEdu = [...field.value];
                          newEdu[index].institution = e.target.value;
                          setValue("education", newEdu);
                        }}
                      />
                      <Input
                        placeholder="Year"
                        value={edu.year}
                        onChange={(e) => {
                          const newEdu = [...field.value];
                          newEdu[index].year = e.target.value;
                          setValue("education", newEdu);
                        }}
                      />
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeItem("education", index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addItem("education")}>
                    <Plus className="h-4 w-4 mr-2" /> Add Education
                  </Button>
                </div>
              )} />
            </div>

            <div>
              <FormLabel>Certifications</FormLabel>
              <Controller control={control} name="certification" render={({ field }) => (
                <div className="space-y-4">
                  {field.value.map((cert, index) => (
                    <div key={index} className="space-y-2 border p-4 rounded">
                      <Input
                        placeholder="Certification Name"
                        value={cert.name}
                        onChange={(e) => {
                          const newCert = [...field.value];
                          newCert[index].name = e.target.value;
                          setValue("certification", newCert);
                        }}
                      />
                      <Input
                        placeholder="Issued By"
                        value={cert.issued_by}
                        onChange={(e) => {
                          const newCert = [...field.value];
                          newCert[index].issued_by = e.target.value;
                          setValue("certification", newCert);
                        }}
                      />
                      <Input
                        placeholder="Year"
                        value={cert.year}
                        onChange={(e) => {
                          const newCert = [...field.value];
                          newCert[index].year = e.target.value;
                          setValue("certification", newCert);
                        }}
                      />
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeItem("certification", index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addItem("certification")}>
                    <Plus className="h-4 w-4 mr-2" /> Add Certification
                  </Button>
                </div>
              )} />
            </div>

            <div>
              <FormLabel>Interests</FormLabel>
              <Controller control={control} name="interests" render={({ field }) => (
                <div className="space-y-2">
                  {field.value.map((interest, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="Interest"
                        value={interest}
                        onChange={(e) => {
                          const newInterests = [...field.value];
                          newInterests[index] = e.target.value;
                          setValue("interests", newInterests);
                        }}
                      />
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeItem("interests", index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addItem("interests")}>
                    <Plus className="h-4 w-4 mr-2" /> Add Interest
                  </Button>
                </div>
              )} />
            </div>

            <div>
              <FormLabel>Contact Information</FormLabel>
              <Controller control={control} name="contact" render={({ field }) => (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Email"
                      value={field.value.email || ""}
                      onChange={(e) => {
                        setValue("contact", {
                          ...field.value,
                          email: e.target.value
                        });
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Phone"
                      value={field.value.phone || ""}
                      onChange={(e) => {
                        setValue("contact", {
                          ...field.value,
                          phone: e.target.value
                        });
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Website"
                      value={field.value.website || ""}
                      onChange={(e) => {
                        setValue("contact", {
                          ...field.value,
                          website: e.target.value
                        });
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="LinkedIn"
                      value={field.value.linkedin || ""}
                      onChange={(e) => {
                        setValue("contact", {
                          ...field.value,
                          linkedin: e.target.value
                        });
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="GitHub"
                      value={field.value.github || ""}
                      onChange={(e) => {
                        setValue("contact", {
                          ...field.value,
                          github: e.target.value
                        });
                      }}
                    />
                  </div>
                </div>
              )} />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default EditProfileForm;