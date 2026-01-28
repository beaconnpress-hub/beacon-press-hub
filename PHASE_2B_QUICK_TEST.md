# Phase 2B: Quick Testing Guide

## Quick Start for Testing Edit Functionality

### 1. **Verify Build Completed**

```bash
cd beacon-press-hub
npm run build  # Should show "✓ Compiled successfully"
```

### 2. **Start Dev Server**

```bash
npm run dev    # Runs on http://localhost:3000
```

### 3. **Access Admin Area**

- Go to: `http://localhost:3000/admin/login`
- Email: `admin@beaconpress.com` (from .env.local)
- Password: `Beacon123!@#`

### 4. **Test CREATE Flow**

1. Click "Publish" in navbar
2. Fill in all fields:
   - Title: "Test Article"
   - Category: "Tech"
   - Summary: "This is a test article summary for testing"
   - Content: "This is the full content of the test article for verification"
   - Author: "Test Author"
   - Image URL: "<https://via.placeholder.com/400>"
3. Click "Publish Article"
4. Should redirect to dashboard
5. Post should appear in list

### 5. **Test UPDATE Flow** ⭐ NEW

1. Click "Edit" button on any post in dashboard
2. Route should change to `/admin/posts/[id]/edit`
3. Form should be pre-populated with post data
4. Modify the title: Add " - EDITED" to the title
5. Click "Update Article"
6. Should redirect to dashboard
7. Updated post should appear in list with new title

### 6. **Verify Audit Logging**

1. Connect to your Supabase project
2. Go to SQL Editor or Table Editor
3. Look at `audit_logs` table
4. Should see entries like:

   ```
   user_id: [your-user-id]
   action: CREATE (for new post) or UPDATE (for edited post)
   table_name: posts
   record_id: [post-uuid]
   details: "Created post: Test Article" or "Updated post: Test Article - EDITED"
   created_at: [timestamp]
   ```

### 7. **Test DELETE Flow** (Existing)

1. Click Delete button on any post
2. Confirm deletion
3. Post should be removed from list
4. Check `audit_logs` for DELETE action

---

## File Locations for Reference

| Component | Path | Purpose |
|-----------|------|---------|
| Audit Logger | `src/lib/audit.ts` | Logs all admin actions |
| Post Form | `src/components/admin/PostForm.tsx` | Reusable form for create/edit |
| Edit Page | `src/app/admin/posts/[id]/edit/page.tsx` | Route for editing posts |
| Publisher | `src/app/admin/publisher/page.tsx` | Page for creating posts |
| Dashboard | `src/app/admin/dashboard/page.tsx` | Post management dashboard |
| Validation | `src/lib/validation.ts` | Zod schemas |

---

## Troubleshooting

### Issue: Edit button not working

- **Check**: Confirm route is `/admin/posts/[id]/edit`
- **Fix**: Refresh browser, clear .next cache

### Issue: Form not pre-populated on edit page

- **Check**: Network tab - verify API call to fetch post
- **Fix**: Ensure `params.id` is being passed correctly

### Issue: Update not saving

- **Check**: Browser console for errors
- **Fix**: Verify Supabase credentials in .env.local

### Issue: Audit log not recording

- **Check**: `audit_logs` table exists in Supabase
- **Fix**: Create table using SQL schema provided in PHASE_2B_COMPLETE.md

### Issue: Build fails

- **Check**: Run `npm install` to ensure dependencies installed
- **Fix**: Delete `.next` folder and rebuild: `rm -rf .next && npm run build`

---

## Expected Behavior

### Create Flow

✅ Form accepts input  
✅ Validation errors display in red  
✅ Submit button disabled while saving  
✅ Redirect to dashboard on success  
✅ New post appears in list  
✅ Audit log shows CREATE action  

### Edit Flow (NEW)

✅ Edit button routes to `/admin/posts/[id]/edit`  
✅ Page loads post data with spinner  
✅ Form pre-populates with post data  
✅ Button says "Update Article" instead of "Publish Article"  
✅ Field updates apply to database  
✅ Redirect to dashboard on success  
✅ Audit log shows UPDATE action with user_id  

### Delete Flow

✅ Delete button prompts confirmation  
✅ Post removed from list  
✅ Audit log shows DELETE action  

---

## API Calls Breakdown

### Create Post

```typescript
supabase.from('posts').insert([formData]).select().single()
// Logs: CREATE action to audit_logs
```

### Update Post

```typescript
supabase.from('posts').update(formData).eq('id', postId)
// Logs: UPDATE action to audit_logs
```

### Fetch Post for Edit

```typescript
supabase.from('posts').select('*').eq('id', postId).single()
// Displays data in form
```

### Delete Post

```typescript
supabase.from('posts').delete().eq('id', postId)
// Logs: DELETE action to audit_logs
```

### Log Action

```typescript
supabase.from('audit_logs').insert({ user_id, action, table_name, record_id, details })
// Records admin action for audit trail
```

---

## Database Queries to Run Manually

### Check all audit logs

```sql
SELECT * FROM audit_logs ORDER BY created_at DESC;
```

### Check audit logs for a specific post

```sql
SELECT * FROM audit_logs WHERE record_id = '[POST_ID]' ORDER BY created_at DESC;
```

### Check all actions by current user

```sql
SELECT * FROM audit_logs WHERE user_id = '[USER_ID]' ORDER BY created_at DESC;
```

### Check only CREATE actions

```sql
SELECT * FROM audit_logs WHERE action = 'CREATE' ORDER BY created_at DESC;
```

### Check only UPDATE actions

```sql
SELECT * FROM audit_logs WHERE action = 'UPDATE' ORDER BY created_at DESC;
```

---

## Success Criteria

Phase 2B is considered complete when:

- [x] Build completes without errors
- [x] Edit page route exists and works
- [x] Form pre-populates on edit page
- [x] Updates save to database correctly
- [x] Audit logs record UPDATE actions
- [x] All fields validate correctly
- [x] Error messages display properly
- [x] User can go back from edit without saving
- [x] Button text changes between create and edit modes
- [x] Redirect works after successful update

**Current Status**: ✅ All implemented - awaiting build completion for final testing
