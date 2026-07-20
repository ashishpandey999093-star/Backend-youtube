import dns from "node:dns/promises";

try {
    const records = await dns.resolveSrv(
        "_mongodb._tcp.cluster0.2j3xaze.mongodb.net"
    );

    console.log(records);
} catch (err) {
    console.error(err);
}