import TicketActions from '@/components/crm/TicketActions'
import { TICKET_PRIORITY_LABELS, TICKET_STATUS_LABELS } from '@/lib/crm/constants'
import { listTickets } from '@/lib/crm/service'

export default async function BackofficeTicketsPage() {
  const tickets = await listTickets()

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold tracking-[0.24em] text-coral-500">מרכז שירות</p>
        <h1 className="mt-2 text-4xl font-black text-[#1a1a2e]">פניות וטיפול בתקלות</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600">
          כל פנייה נשמרת סביב הלקוח, הספר וההזמנה, עם פעולות מהירות לפיצוי, לזיכוי או ליצירה
          מחדש של עמוד פגום.
        </p>
      </section>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <article key={ticket.id} className="rounded-[1.75rem] border border-coral-100 bg-white p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-coral-500">
                  {TICKET_STATUS_LABELS[ticket.status as keyof typeof TICKET_STATUS_LABELS]} ·{' '}
                  {TICKET_PRIORITY_LABELS[ticket.priority as keyof typeof TICKET_PRIORITY_LABELS]}
                </p>
                <h2 className="mt-2 text-2xl font-black text-[#1a1a2e]">{ticket.subject}</h2>
                <p className="mt-2 text-sm font-semibold text-gray-700">
                  {ticket.customer_profiles?.full_name ||
                    ticket.customer_profiles?.email ||
                    'לקוח לא מזוהה'}
                </p>
                <p className="mt-3 max-w-4xl text-sm leading-7 text-gray-600">{ticket.message}</p>
              </div>

              <div className="rounded-[1.25rem] bg-[#FFF9F0] px-4 py-3 text-sm text-gray-600">
                {ticket.books?.title ? <p>ספר: {ticket.books.title}</p> : null}
                {ticket.orders?.order_number ? <p>הזמנה #{ticket.orders.order_number}</p> : null}
                <p>{new Date(ticket.created_at).toLocaleString('he-IL')}</p>
              </div>
            </div>

            <TicketActions ticketId={ticket.id} bookId={ticket.book_id} />
          </article>
        ))}
      </div>
    </div>
  )
}
