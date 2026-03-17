import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, message } = body

    // Validación básica del lado servidor
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios." },
        { status: 400 }
      )
    }

    // Validación simple de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "El email no es válido." },
        { status: 400 }
      )
    }

    // Envío del correo
    await resend.emails.send({
      from: "Node3 Web <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL || "node3solutions@gmail.com",
      subject: "Nuevo contacto desde la web - Node3",
      replyTo: email,
      text: `
Nuevo mensaje desde la landing de Node3

Nombre: ${name}
Email: ${email}

Mensaje:
${message}
      `,
    })

    return NextResponse.json(
      { message: "Mensaje enviado correctamente." },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error al enviar el formulario:", error)

    return NextResponse.json(
      { error: "No se pudo enviar el mensaje." },
      { status: 500 }
    )
  }
}