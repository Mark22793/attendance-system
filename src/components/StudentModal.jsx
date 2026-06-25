import { useState } from "react";

export default function StudentModal({ onClose, onSave, editData }) {
  const [form, setForm] = useState(
    editData || { name: "", course: "", section: "" }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000aa" }}>
      <div style={{ background: "#fff", margin: 100, padding: 20 }}>
        <h3>{editData ? "Edit Student" : "Add Student"}</h3>

        <input name="name" placeholder="Name" onChange={handleChange} value={form.name} />
        <input name="course" placeholder="Course" onChange={handleChange} value={form.course} />
        <input name="section" placeholder="Section" onChange={handleChange} value={form.section} />

        <br /><br />

        <button onClick={() => onSave({ ...form, id: editData?.id })}>
          Save
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}