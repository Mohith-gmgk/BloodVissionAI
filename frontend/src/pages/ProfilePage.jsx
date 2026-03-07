import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { updateProfile, changePassword } from "../utils/api";
import { Card, Input, Btn, PwStrength, AvatarUpload, Alert } from "../components/UI";
import { COLORS } from "../utils/theme";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const saveProfile = async () => {
    setSaving(true); setProfileMsg({ type: "", text: "" });
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      if (avatar) fd.append("avatar", avatar);
      const res = await updateProfile(fd);
      updateUser({ ...form, avatar, ...res.data.user });
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.response?.data?.error || "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  const submitPasswordChange = async () => {
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      setPwMsg({ type: "error", text: "All fields are required" }); return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwMsg({ type: "error", text: "Passwords don't match" }); return;
    }
    setChangingPw(true); setPwMsg({ type: "", text: "" });
    try {
      await changePassword(pwForm.current, pwForm.next);
      setPwMsg({ type: "success", text: "Password changed successfully!" });
      setPwForm({ current: "", next: "", confirm: "" });
    } catch (err) {
      setPwMsg({ type: "error", text: err.response?.data?.error || "Password change failed" });
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "100px 20px 60px", maxWidth: 700, margin: "0 auto" }}>
      <h2 style={{ fontSize: 30, fontFamily: "Georgia, serif", color: COLORS.text, marginBottom: 32 }}>
        ⚙️ Profile Settings
      </h2>

      {/* Profile info */}
      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ color: COLORS.text, marginBottom: 20 }}>Profile Information</h3>
        <AvatarUpload value={avatar} onChange={setAvatar} />
        <Alert type={profileMsg.type} message={profileMsg.text} />
        <Input label="Full Name" value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))} icon="👤" />
        <Input label="Email" type="email" value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))} icon="✉️" />
        <Input label="Phone" value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} icon="📞" />
        <Btn onClick={saveProfile} disabled={saving} style={{ marginTop: 8 }}>
          {saving ? "Saving…" : "Save Changes"}
        </Btn>
      </Card>

      {/* Change password */}
      <Card>
        <h3 style={{ color: COLORS.text, marginBottom: 20 }}>Change Password</h3>
        <Alert type={pwMsg.type} message={pwMsg.text} />
        <Input label="Current Password" type="password" value={pwForm.current}
          onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} icon="🔒" />
        <Input label="New Password" type="password" value={pwForm.next}
          onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))} icon="🔒" />
        <PwStrength password={pwForm.next} />
        <Input label="Confirm New Password" type="password" value={pwForm.confirm}
          onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} icon="🔒" />
        <Btn onClick={submitPasswordChange} disabled={changingPw} style={{ marginTop: 8 }}>
          {changingPw ? "Updating…" : "Update Password"}
        </Btn>
      </Card>
    </div>
  );
}
