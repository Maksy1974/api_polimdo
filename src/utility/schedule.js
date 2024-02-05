const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const jadwal = async () => {

        const idDobiayai = []
        const judulUpdate = []
        
        const cekRevisi = await prisma.reviewPenelitian.findMany({
            where: {
                revisi: null
            }
        })
        
        cekRevisi.map((data, i) => {
            idDobiayai.push(data.id)
        })

        
        const cekStatusPenelitianDIbiayai = await prisma.nilaiPenelitian.groupBy({
            where: {
                idReviewPenelitian: {in: idDobiayai}
            },
            by: ['judulPenelitian'],
            _count: {
                _all: true,
                nilai: true,
            },
            _sum: {
                nilai: true,
            },
            _avg: {
                nilai: true
            },
            orderBy: {
                judulPenelitian: 'desc',
            },
            having: {
                nilai: {
                  _avg: {
                    gt: 75,
                  },
                },
              },
        })

        cekStatusPenelitianDIbiayai.map((data) => {
            judulUpdate.push(data.judulPenelitian)
        })

        
        const updateStatusPenelitianDibiayai = await prisma.penelitian.updateMany({
            where: {
                judul: {in: judulUpdate}
            },
            data: {
                statusPenelitian: 5
            }
        })


        const updateStatusPenelitianGagalDibiayai = await prisma.penelitian.updateMany({
            where: {
                judul: {notIn: judulUpdate}
            },
            data: {
                statusPenelitian: 4
            }
        })

        const cekpartisipenelitianDibiayai = await prisma.partisipasiPenelitian.findMany({
            where: {
                judulPenelitian: {in: judulUpdate}
            }
        })

        const cekpartisipenelitianGagalbiayai = await prisma.partisipasiPenelitian.findMany({
            where: {
                judulPenelitian: {notIn: judulUpdate}
            }
        })

        const dataNotificationDibiayai = cekpartisipenelitianDibiayai.map(data => {
            return {
                nameUser: data.nameUser,
                judulPenelitian: data.judulPenelitian,
                pesan: "Penelitian Kalian Dibiayai"
            }
        })

        const dataNotificationNotbiayai = cekpartisipenelitianGagalbiayai.map(data => {
            return {
                nameUser: data.nameUser,
                judulPenelitian: data.judulPenelitian,
                pesan: "Penelitian Kalian Tidak Dibiayai"
            }
        })

        await prisma.Notification.createMany({
            data: dataNotificationDibiayai
        })

        await prisma.Notification.createMany({
            data: dataNotificationNotbiayai
        })
}



// 
// const { PrismaClient } = require('@prisma/client')

// const prisma = new PrismaClient()

// const hendleSchedule = async () => {
//   const cekJadwal = await prisma.jadwalP3M.findUnique({
//     where: {
//         jadwalJudul: "Penilaian Usulan"
//     },
//     select: {
//         tglAkhir: true
//     }
//   })
  
//   if (cekJadwal) {
//     console.log(cekJadwal)
//     const someDate = new Date(cekJadwal.tglAkhir)
//     schedule.scheduleJob(someDate, () => {
//       console.log(cekJadwal)
//       console.log('jon run', new Date)
//       jadwal()
//     })
//   }
// }


// hendleSchedule()

// 

module.exports = {
    jadwal
}