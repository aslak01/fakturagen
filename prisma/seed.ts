import { PrismaClient } from '@prisma/client'
import { md5 } from 'hash-wasm'
const aMonthInTheFuture = (
  lessThanAMonthFactor = 0,
  moreThanAMonthFactor = 0
) =>
  new Date().getTime() +
  1000 * 3600 * 24 * (30.5 - lessThanAMonthFactor + moreThanAMonthFactor);
const prisma = new PrismaClient()

async function main() {
  await prisma.user.deleteMany({})
  await prisma.meta.deleteMany({})
  await prisma.address.deleteMany({})
  await prisma.company.deleteMany({})
  await prisma.bank.deleteMany({})
  await prisma.invoice.deleteMany({})
  await prisma.invoiceLine.deleteMany({})

  await prisma.user.create({
    data: {
      name: "Test Bruker",
      email: "demo@notreal.email",
      passwordHash: await md5('demo'),
      company: {
        create: {
          name: "Test Firma",
          currency: "NOK",
          bank: {
            create: {
              accno: '123412341234',
              iban: 'ibaniban',
              bic: 'whatsabicagain',
              name: "test bank"
            }
          },
          address: {
            create: {
              street: "Some Street",
              poNo: "1234",
              city: "some city",
              country: "Some country"
            }
          },
          meta: {
            create: {
              locale: "nb-NO",
              vatEnabled: true,
              vatRate: 25
            }
          }
        }
      }
    }
  })

  await prisma.company.create({
    data: {
      name: 'Customer',
      currency: 'EUR',
      address: {
        create: {
          street: 'Street',
          poNo: '1233',
          city: 'Citystan',
          country: 'Countrynesia'
        }
      },
      invoices: {
        create: [
          {
            number: 1234,
            date: new Date(),
            dueDate: new Date(aMonthInTheFuture()),
            paid: true,
            sumPaid: 1234,
            currValue: 3.14,
            lines: {
              create: [
                {
                  doneDate: new Date(),
                  description: 'Some service',
                  value: 3,
                  currency: 'EUR',
                  hasVat: true,
                  vatAmt: 0.75
                },
                {
                  doneDate: new Date(),
                  description: 'Some other service',
                  value: 0.14,
                  currency: 'EUR',
                  hasVat: true,
                  vatAmt: 0.01
                }
              ]
            }
          }
        ]
      }

    }
  })


}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
