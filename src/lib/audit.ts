import { SupabaseClient } from '@supabase/supabase-js'

export async function logAdminAction(
    supabase: SupabaseClient,
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    table: string,
    record_id: string,
    details?: string
) {
    try {
        const { data: { user } } = await supabase.auth.getUser()

        await supabase.from('audit_logs').insert({
            user_id: user?.id,
            action,
            table_name: table,
            record_id: record_id,
            details: details || 'Admin operation'
        })
    } catch (error) {
        console.error('Audit log failed:', error)
        // Don't block the UI if audit fails, but log it to console
    }
}
