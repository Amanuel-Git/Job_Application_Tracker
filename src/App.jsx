import { useEffect, useMemo, useState } from 'react'
import { supabase } from './SupabaseClient'
import './App.css'

const STATUS_OPTIONS = ['Applied', 'Interview', 'Rejected']

function App() {
  const [applications, setApplications] = useState([])
  const [filter, setFilter] = useState('All')
  const [form, setForm] = useState({
    company: '',
    role: '',
    status: STATUS_OPTIONS[0],
    notes: '',
  })

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching applications:', error)
    } else {
      setApplications(data || [])
    }
  }

  const filteredApplications = useMemo(() => {
    if (filter === 'All') return applications
    return applications.filter((item) => item.status === filter)
  }, [applications, filter])

  const handleInput = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log('handleSubmit called', form)
    if (!form.company.trim() || !form.role.trim()) {
      console.log('Form validation failed')
      return
    }

    console.log('Inserting application...')
    const { data, error } = await supabase
      .from('applications')
      .insert([
        {
          company: form.company.trim(),
          role: form.role.trim(),
          status: form.status,
          notes: form.notes.trim(),
        }
      ])

    if (error) {
      console.error('Error adding application:', error)
    } else {
      console.log('Application added successfully')
      fetchApplications()
      setForm({ company: '', role: '', status: STATUS_OPTIONS[0], notes: '' })
    }
  }

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error('Error updating status:', error)
    } else {
      fetchApplications()
    }
  }

  const updateNotes = async (id, notes) => {
    const { error } = await supabase
      .from('applications')
      .update({ notes })
      .eq('id', id)

    if (error) {
      console.error('Error updating notes:', error)
    } else {
      fetchApplications()
    }
  }

  const removeApplication = async (id) => {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error removing application:', error)
    } else {
      fetchApplications()
    }
  }

  return (
    <main className="tracker-shell">
      <header className="tracker-header">
        <div>
          <p className="eyebrow">Student Job Application Tracker</p>
          <h1>Keep track of every job application</h1>
          <p className="lead">
            Save the company, role, status, and notes so you never forget where you
            applied.
          </p>
        </div>
      </header>

      <section className="tracker-panel">
        <form className="tracker-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              name="company"
              value={form.company}
              onChange={handleInput}
              placeholder="e.g. Acme Software"
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="role">Role</label>
            <input
              id="role"
              name="role"
              value={form.role}
              onChange={handleInput}
              placeholder="e.g. Frontend Intern"
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleInput}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group field-notes">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleInput}
              placeholder="Add anything important: interview date, recruiter name, follow-up reminders..."
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="primary-button"
          >
            Add application
          </button>
        </form>

        <aside className="tracker-summary">
          <p className="summary-label">Application status</p>
          <div className="status-row">
            <button
              type="button"
              className={filter === 'All' ? 'filter-button active' : 'filter-button'}
              onClick={() => setFilter('All')}
            >
              All ({applications.length})
            </button>
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                type="button"
                className={filter === status ? 'filter-button active' : 'filter-button'}
                onClick={() => setFilter(status)}
              >
                {status} ({applications.filter((item) => item.status === status).length})
              </button>
            ))}
          </div>
          <p className="summary-copy">
            Track every company, store your current stage, and keep follow-up notes
            all in one place.
          </p>
        </aside>
      </section>

      <section className="application-list">
        {filteredApplications.length === 0 ? (
          <div className="empty-state">
            <h2>No applications yet</h2>
            <p>Add the first company and role to start tracking your progress.</p>
          </div>
        ) : (
          filteredApplications.map((application) => (
            <article key={application.id} className="application-card">
              <div className="application-header">
                <div>
                  <p className="company-name">{application.company}</p>
                  <p className="role-name">{application.role}</p>
                </div>
                <span className={`status-chip status-${application.status.toLowerCase()}`}>
                  {application.status}
                </span>
              </div>

              <div className="application-controls">
                <label>
                  Change status
                  <select
                    value={application.status}
                    onChange={(event) => updateStatus(application.id, event.target.value)}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  className="danger-button"
                  onClick={() => removeApplication(application.id)}
                >
                  Remove
                </button>
              </div>

              <label className="notes-label" htmlFor={`notes-${application.id}`}>
                Notes
              </label>
              <textarea
                id={`notes-${application.id}`}
                value={application.notes}
                onChange={(event) => updateNotes(application.id, event.target.value)}
                rows={3}
                className="notes-textarea"
              />
            </article>
          )))}
      </section>
    </main>
  )
}

export default App
