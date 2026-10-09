/* M02 – Networking fundamentals (before AWS)
 * Assembled from per-lesson sections; each lesson pushes onto LESSONS / FLASHCARDS. */
(function () {
  var LESSONS = [], FLASHCARDS = [];

  // ================================================================== 01_osi.js
/* ================================================================ M02.01 OSI and TCP/IP models */
var DG_0201_STACK = `
<figure>
<svg class="diagram" viewBox="0 0 760 430" role="img" aria-labelledby="m0201at m0201ad">
  <title id="m0201at">OSI model, TCP/IP model, PDUs and AWS examples</title>
  <desc id="m0201ad">The seven OSI layers on the left are mapped to the four TCP/IP layers. Each row shows the unit of data, the address used and AWS services that act at that layer.</desc>
  <text class="dg-ta" x="10" y="20">OSI (7 layers)</text>
  <text class="dg-ta" x="200" y="20">TCP/IP (4)</text>
  <text class="dg-ta" x="330" y="20">PDU · address</text>
  <text class="dg-ta" x="520" y="20">AWS examples</text>

  <rect class="dg-edge" x="10" y="32" width="180" height="40" rx="6"/><text class="dg-tb" x="20" y="57">7 Application</text>
  <rect class="dg-edge" x="10" y="76" width="180" height="40" rx="6"/><text class="dg-tb" x="20" y="101">6 Presentation</text>
  <rect class="dg-edge" x="10" y="120" width="180" height="40" rx="6"/><text class="dg-tb" x="20" y="145">5 Session</text>
  <rect class="dg-edge" x="200" y="32" width="120" height="128" rx="6"/><text class="dg-tb" x="212" y="92">Application</text>
  <text class="dg-ts" x="212" y="110">HTTP, DNS, TLS*</text>
  <rect class="dg-box" x="330" y="32" width="180" height="128" rx="6"/>
  <text class="dg-t" x="340" y="80">Data / message</text>
  <text class="dg-ts" x="340" y="98">URL, Host header,</text>
  <text class="dg-ts" x="340" y="112">path, cookies</text>
  <rect class="dg-box" x="520" y="32" width="230" height="128" rx="6"/>
  <text class="dg-t" x="530" y="58">ALB · API Gateway</text>
  <text class="dg-t" x="530" y="80">CloudFront · AWS WAF</text>
  <text class="dg-t" x="530" y="102">Route 53 (DNS)</text>
  <text class="dg-t" x="530" y="124">ACM (TLS certificates)</text>
  <text class="dg-ts" x="530" y="146">Shield Advanced (L7 help)</text>

  <rect class="dg-info" x="10" y="166" width="180" height="56" rx="6"/><text class="dg-tb" x="20" y="199">4 Transport</text>
  <rect class="dg-info" x="200" y="166" width="120" height="56" rx="6"/><text class="dg-tb" x="212" y="192">Transport</text>
  <text class="dg-ts" x="212" y="210">TCP, UDP</text>
  <rect class="dg-box" x="330" y="166" width="180" height="56" rx="6"/>
  <text class="dg-t" x="340" y="190">Segment / datagram</text>
  <text class="dg-ts" x="340" y="208">port number (443, 53)</text>
  <rect class="dg-box" x="520" y="166" width="230" height="56" rx="6"/>
  <text class="dg-t" x="530" y="190">NLB · Global Accelerator</text>
  <text class="dg-ts" x="530" y="208">SG/NACL port rules · Shield Std</text>

  <rect class="dg-good" x="10" y="228" width="180" height="56" rx="6"/><text class="dg-tb" x="20" y="261">3 Network</text>
  <rect class="dg-good" x="200" y="228" width="120" height="56" rx="6"/><text class="dg-tb" x="212" y="254">Internet</text>
  <text class="dg-ts" x="212" y="272">IP, ICMP</text>
  <rect class="dg-box" x="330" y="228" width="180" height="56" rx="6"/>
  <text class="dg-t" x="340" y="252">Packet</text>
  <text class="dg-ts" x="340" y="270">IP address (10.0.1.25)</text>
  <rect class="dg-box" x="520" y="228" width="230" height="56" rx="6"/>
  <text class="dg-t" x="530" y="252">VPC route tables · IGW · NAT</text>
  <text class="dg-ts" x="530" y="270">GWLB · Transit Gateway · SG/NACL IPs</text>

  <rect class="dg-az" x="10" y="290" width="180" height="40" rx="6"/><text class="dg-tb" x="20" y="315">2 Data link</text>
  <rect class="dg-az" x="10" y="334" width="180" height="40" rx="6"/><text class="dg-tb" x="20" y="359">1 Physical</text>
  <rect class="dg-az" x="200" y="290" width="120" height="84" rx="6"/><text class="dg-tb" x="212" y="322">Link /</text>
  <text class="dg-tb" x="212" y="340">Network</text>
  <text class="dg-tb" x="212" y="358">access</text>
  <rect class="dg-box" x="330" y="290" width="180" height="40" rx="6"/>
  <text class="dg-t" x="340" y="308">Frame</text><text class="dg-ts" x="400" y="308">MAC address</text>
  <rect class="dg-box" x="330" y="334" width="180" height="40" rx="6"/>
  <text class="dg-t" x="340" y="358">Bits (signals)</text>
  <rect class="dg-box" x="520" y="290" width="230" height="84" rx="6"/>
  <text class="dg-t" x="530" y="314">ENI (has a MAC address)</text>
  <text class="dg-t" x="530" y="336">Direct Connect (fibre port)</text>
  <text class="dg-ts" x="530" y="358">AWS-managed: you don't see L1/L2</text>

  <text class="dg-ts" x="10" y="400">* TLS sits between transport and application; in OSI terms it is usually placed at layer 6 (presentation).</text>
  <text class="dg-ts" x="10" y="418">Mnemonics: "All People Seem To Need Data Processing" (7→1) · "Please Do Not Throw Sausage Pizza Away" (1→7)</text>
</svg>
<figcaption>Figure M02-1. The OSI and TCP/IP models side by side. Exam questions use OSI layer numbers ("layer 4", "layer 7"); real protocols follow TCP/IP.</figcaption>
</figure>`;

var DG_0201_ENCAP = `
<figure>
<svg class="diagram" viewBox="0 0 760 300" role="img" aria-labelledby="m0201bt m0201bd">
  <title id="m0201bt">Encapsulation of an HTTPS request</title>
  <desc id="m0201bd">The application data is wrapped by a TCP header to form a segment, by an IP header to form a packet and by an Ethernet header and trailer to form a frame. The receiver removes them in reverse order.</desc>
  <defs><marker id="m0201b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <text class="dg-ta" x="10" y="20">Sender: going DOWN the stack (encapsulation)</text>

  <rect class="dg-edge" x="430" y="34" width="220" height="34" rx="4"/><text class="dg-t" x="442" y="56">HTTP request (TLS-encrypted)</text>
  <text class="dg-ts" x="660" y="56">L7 data</text>

  <rect class="dg-info" x="330" y="80" width="100" height="34" rx="4"/><text class="dg-t" x="340" y="102">TCP header</text>
  <rect class="dg-edge" x="430" y="80" width="220" height="34" rx="4"/><text class="dg-t" x="442" y="102">data</text>
  <text class="dg-ts" x="660" y="102">L4 segment</text>
  <text class="dg-ts" x="200" y="102">src/dst port, seq #</text>

  <rect class="dg-good" x="230" y="126" width="100" height="34" rx="4"/><text class="dg-t" x="242" y="148">IP header</text>
  <rect class="dg-info" x="330" y="126" width="100" height="34" rx="4"/><text class="dg-t" x="340" y="148">TCP</text>
  <rect class="dg-edge" x="430" y="126" width="220" height="34" rx="4"/><text class="dg-t" x="442" y="148">data</text>
  <text class="dg-ts" x="660" y="148">L3 packet</text>
  <text class="dg-ts" x="100" y="148">src/dst IP, TTL</text>

  <rect class="dg-az" x="120" y="172" width="110" height="34" rx="4"/><text class="dg-t" x="130" y="194">Eth header</text>
  <rect class="dg-good" x="230" y="172" width="100" height="34" rx="4"/><text class="dg-t" x="242" y="194">IP</text>
  <rect class="dg-info" x="330" y="172" width="100" height="34" rx="4"/><text class="dg-t" x="340" y="194">TCP</text>
  <rect class="dg-edge" x="430" y="172" width="220" height="34" rx="4"/><text class="dg-t" x="442" y="194">data</text>
  <rect class="dg-az" x="650" y="172" width="50" height="34" rx="4"/><text class="dg-ts" x="656" y="194">FCS</text>
  <text class="dg-ts" x="10" y="194">src/dst MAC</text>
  <text class="dg-ts" x="706" y="194">L2 frame</text>

  <rect class="dg-box" x="120" y="218" width="580" height="26" rx="4"/><text class="dg-t" x="130" y="236">0110100101110010... bits on fibre, copper or radio (L1)</text>

  <path class="dg-line" d="M40 40 V250" marker-end="url(#m0201b-ar)"/>
  <text class="dg-ts" x="10" y="270">Receiver goes UP the stack (decapsulation): each layer reads and strips its own header, then hands the rest up.</text>
  <text class="dg-ts" x="10" y="288">Routers rewrite the L2 header at every hop; the L3 IP header (except TTL/checksum) normally stays the same end to end.</text>
</svg>
<figcaption>Figure M02-2. Each layer adds its own header in front of the data from the layer above. Header bytes count against the MTU.</figcaption>
</figure>`;

LESSONS.push({
  id: "M02.01", title: "OSI and TCP/IP models", level: 100, minutes: 45,
  objectives: [
    "Name the seven OSI layers, their units of data (PDUs), addresses and typical devices",
    "Map the OSI model to the four-layer TCP/IP model used by real protocols",
    "Trace a web request through encapsulation and decapsulation, including MTU limits",
    "Explain what a layer 4 load balancer can see compared with a layer 7 one, and choose NLB, ALB or GWLB",
    "Place AWS network controls (security groups, NACLs, WAF, Shield, Network Firewall) at the right layer and troubleshoot bottom-up"
  ],
  sections: [
    { type: "why", html: `
<p>An exam question says: <em>"The application must route requests to different target groups based on the URL path"</em>. Another says: <em>"The solution must handle millions of requests per second with ultra-low latency and provide a static IP address"</em>. The first answer is an <strong>Application Load Balancer (layer 7)</strong>; the second is a <strong>Network Load Balancer (layer 4)</strong>. You can only tell them apart if you know what information exists at each layer.</p>
<p>The same vocabulary appears at work. "Is it a layer 3 or a layer 7 problem?" is the first question in any outage call. A security group can block a <em>port</em> but cannot see a <em>URL</em>; AWS WAF can see the URL. Choosing the wrong layer means a control that cannot possibly work.</p>` },

    { type: "concept", html: DG_0201_STACK + `
<h3>Why networks are described in layers</h3>
<p>Networking is split into <strong>layers</strong> so that each one solves one problem and relies only on the layer below. Your browser does not care whether the bits travel over Wi-Fi or fibre; Wi-Fi does not care whether it is carrying a web page or a video call. Because the layers are independent, each can change without breaking the others (HTTP/1.1 became HTTP/2 without changing IP; copper became fibre without changing TCP).</p>
<p>Two models describe these layers:</p>
<ul>
  <li><strong>OSI model</strong> (Open Systems Interconnection, ISO, 1984): seven layers. It is a <em>teaching and vocabulary</em> model. When people say "layer 7" or "L4", they mean OSI numbers.</li>
  <li><strong>TCP/IP model</strong> (the Internet protocol suite): four layers. This is what the internet actually runs on.</li>
</ul>

<h3>The seven OSI layers</h3>
<table>
<thead><tr><th>#</th><th>Layer</th><th>Job</th><th>PDU (unit of data)</th><th>Address / identifier</th><th>Examples</th><th>Devices</th></tr></thead>
<tbody>
<tr><td>7</td><td><strong>Application</strong></td><td>The protocol the application speaks</td><td>Data / message</td><td>URL, HTTP Host header, path, email address</td><td>HTTP, HTTPS, DNS, SMTP, SSH, FTP</td><td>L7 load balancer, API gateway, WAF, reverse proxy</td></tr>
<tr><td>6</td><td><strong>Presentation</strong></td><td>Format, encoding, encryption</td><td>Data</td><td>–</td><td>TLS encryption, JSON, UTF-8, JPEG, compression</td><td>(software)</td></tr>
<tr><td>5</td><td><strong>Session</strong></td><td>Open, maintain and close conversations</td><td>Data</td><td>Session ID</td><td>RPC sessions, NetBIOS; in practice folded into L7/L4</td><td>(software)</td></tr>
<tr><td>4</td><td><strong>Transport</strong></td><td>End-to-end delivery between <em>processes</em>: reliability, ordering, flow control</td><td><strong>Segment</strong> (TCP) / <strong>datagram</strong> (UDP)</td><td><strong>Port number</strong> (0–65535)</td><td>TCP, UDP, QUIC (over UDP)</td><td>L4 load balancer, stateful firewall</td></tr>
<tr><td>3</td><td><strong>Network</strong></td><td>Logical addressing and <em>routing</em> between networks</td><td><strong>Packet</strong></td><td><strong>IP address</strong></td><td>IPv4, IPv6, ICMP (ping), IPsec</td><td>Router, L3 switch</td></tr>
<tr><td>2</td><td><strong>Data link</strong></td><td>Delivery between devices on the <em>same</em> local network; error detection</td><td><strong>Frame</strong></td><td><strong>MAC address</strong> (48-bit, e.g. 0a:1b:2c:3d:4e:5f)</td><td>Ethernet, Wi-Fi (802.11), ARP*, VLAN tags (802.1Q)</td><td>Switch, bridge, network card</td></tr>
<tr><td>1</td><td><strong>Physical</strong></td><td>Move raw bits as electrical, optical or radio signals</td><td><strong>Bits</strong></td><td>–</td><td>Fibre, copper (1000BASE-T), radio, connectors</td><td>Cable, hub, repeater, transceiver</td></tr>
</tbody></table>
<p class="small muted">* ARP (Address Resolution Protocol) maps an IP address to a MAC address on the local network. It sits between L2 and L3. In an AWS VPC you never see real ARP traffic; the VPC fabric answers it for you.</p>

<div class="callout tip"><strong>Remember the PDUs in order (L4 → L1):</strong> <em>Segments, Packets, Frames, Bits</em>, "Some People Fear Birthdays". Everything above L4 is just "data".</div>

<h3>The four-layer TCP/IP model</h3>
<table>
<thead><tr><th>TCP/IP layer</th><th>Covers OSI layers</th><th>Protocols</th></tr></thead>
<tbody>
<tr><td><strong>Application</strong></td><td>5, 6, 7</td><td>HTTP/1.1, HTTP/2, HTTP/3, DNS, TLS (usually), SSH, SMTP, gRPC</td></tr>
<tr><td><strong>Transport</strong></td><td>4</td><td>TCP, UDP</td></tr>
<tr><td><strong>Internet</strong></td><td>3</td><td>IPv4, IPv6, ICMP</td></tr>
<tr><td><strong>Link</strong> (network access)</td><td>1, 2</td><td>Ethernet, Wi-Fi, ARP</td></tr>
</tbody></table>
<p>Some textbooks show a five-layer "hybrid" model that splits Link into Data link and Physical. The numbering people use in conversation still comes from OSI.</p>

<h3>Addressing: who is talking to whom?</h3>
<p>Each layer has its own address, and a full conversation needs all of them:</p>
<ul>
  <li><strong>MAC address (L2)</strong> identifies a network interface on the local segment. It only matters for the <em>next hop</em>; it changes at every router.</li>
  <li><strong>IP address (L3)</strong> identifies a host across networks. It stays the same from source to destination (unless NAT rewrites it, see M02.03).</li>
  <li><strong>Port (L4)</strong> identifies a process on that host: 443 for HTTPS, 22 for SSH, 5432 for PostgreSQL. The client side uses a random <em>ephemeral port</em> (for example 1024–65535).</li>
  <li><strong>Hostname, URL path, headers (L7)</strong> identify the resource: <code>https://shop.example.com/cart?id=7</code>.</li>
</ul>
<p>A TCP connection is uniquely identified by its <strong>5-tuple</strong>: <em>protocol, source IP, source port, destination IP, destination port</em>. Firewalls, NAT devices, flow logs and L4 load balancers all work with the 5-tuple.</p>

<h3>Encapsulation and decapsulation</h3>
` + DG_0201_ENCAP + `
<p>When an application sends data, each layer <strong>wraps</strong> the data from the layer above in its own header (encapsulation). The receiver removes the headers in reverse order (decapsulation). Each device in the path only opens the layers it needs:</p>
<ul>
  <li>A <strong>switch</strong> reads the L2 header (MAC) and forwards the frame.</li>
  <li>A <strong>router</strong> reads up to L3 (IP), picks the next hop, and writes a <em>new</em> L2 header.</li>
  <li>A <strong>stateful firewall or L4 load balancer</strong> reads up to L4 (ports, TCP flags).</li>
  <li>An <strong>L7 proxy or load balancer</strong> terminates TCP (and usually TLS), reads the full HTTP request and opens a <em>new</em> connection to the backend.</li>
</ul>

<h3>MTU: how big can a packet be?</h3>
<p>The <strong>MTU (maximum transmission unit)</strong> is the largest L3 packet a link can carry in one frame.</p>
<ul>
  <li>Standard Ethernet and the public internet: <strong>1500 bytes</strong>. After a 20-byte IPv4 header and a 20-byte TCP header, about 1460 bytes of data fit per segment (this is the TCP <strong>MSS</strong>, maximum segment size).</li>
  <li><strong>Jumbo frames</strong>: up to <strong>9001 bytes</strong> between most current EC2 instances <em>inside a VPC</em>. Traffic that leaves the VPC through an internet gateway, a VPN or (in many cases) across peering is limited to 1500 or less. Jumbo frames reduce per-packet overhead for bulk data inside a cluster.</li>
  <li>Tunnels add headers: an IPsec VPN tunnel typically reduces usable MTU to around 1400–1436 bytes.</li>
  <li>If a packet is bigger than the next link's MTU, a router either <strong>fragments</strong> it (IPv4 only, slow, often blocked) or drops it and sends back an ICMP "fragmentation needed" (or IPv6 "packet too big") message. <strong>Path MTU Discovery (PMTUD)</strong> relies on those ICMP messages to find the largest size that fits.</li>
</ul>
<div class="callout warn"><strong>Classic gotcha:</strong> blocking <em>all</em> ICMP in a firewall breaks PMTUD. Small requests work, but large responses hang. If SSH logs in but <code>ls</code> of a big directory freezes, or a page loads half-way over a VPN, suspect MTU.</div>` },

    { type: "workflow", title: "Packet walk: a browser loads https://shop.example.com", html: `
<p>Follow one request from a laptop to a web server. The steps you will meet again in later lessons are tagged with their module.</p>
<ol class="flow">
  <li><strong>L7, name resolution.</strong> The browser needs an IP for <code>shop.example.com</code>. It asks the OS resolver, which sends a DNS query (UDP port 53) and gets back, say, <code>203.0.113.10</code>. (Detailed in M02.04.)</li>
  <li><strong>L4, connection.</strong> The OS opens a TCP connection: SYN → SYN-ACK → ACK from a random ephemeral source port (e.g. 51544) to destination port 443. (M02.05.)</li>
  <li><strong>L6, encryption.</strong> The TLS handshake agrees keys and verifies the server certificate. From now on the HTTP data is encrypted. (M02.05.)</li>
  <li><strong>L7, request.</strong> The browser writes <code>GET /cart HTTP/1.1</code> with a <code>Host: shop.example.com</code> header and cookies. TLS encrypts it into records.</li>
  <li><strong>L4, segment.</strong> TCP splits the stream into segments that fit the MSS, numbers them and adds ports.</li>
  <li><strong>L3, packet.</strong> IP adds source <code>192.168.1.23</code> and destination <code>203.0.113.10</code>. The destination is not local, so the packet goes to the <strong>default gateway</strong> (the home router). (M02.03.)</li>
  <li><strong>L2, frame.</strong> ARP finds the router's MAC. The NIC builds an Ethernet frame: destination MAC = router, source MAC = laptop.</li>
  <li><strong>L1, bits.</strong> The frame is sent as radio waves (Wi-Fi) to the router.</li>
  <li><strong>Every router hop.</strong> The home router strips the L2 frame, <strong>NATs</strong> the private source IP to its public IP, decrements TTL, builds a new frame for the ISP link. Each internet router repeats: read L3, look up the route, new L2 header.</li>
  <li><strong>Arrival.</strong> The server's NIC accepts the frame (L2), IP confirms the destination address (L3), TCP reassembles segments in order and acknowledges them (L4), TLS decrypts (L6), and the web server process listening on port 443 reads the HTTP request (L7).</li>
  <li><strong>Response.</strong> The reply goes back the same way with source and destination swapped: from port 443 to the client's ephemeral port 51544.</li>
</ol>
<div class="callout">If there is an <strong>Application Load Balancer</strong> in front of the server, step 10 happens <em>at the ALB</em>: it terminates TCP and TLS, reads the HTTP request, picks a target, and opens a second, separate TCP connection to the instance. A <strong>Network Load Balancer</strong> instead forwards the TCP flow itself (by default preserving the client IP), so the instance terminates TCP and TLS.</div>` },

    { type: "aws", title: "Layers on AWS: load balancers and security controls", html: `
<h3>Why a load balancer is "L4" or "L7"</h3>
<p>A load balancer can only make decisions using information it can read. That is set by the highest layer it parses.</p>
<table>
<thead><tr><th></th><th>Network Load Balancer (NLB)</th><th>Application Load Balancer (ALB)</th><th>Gateway Load Balancer (GWLB)</th></tr></thead>
<tbody>
<tr><td>Layer</td><td><strong>4</strong> (TCP, UDP, TLS)</td><td><strong>7</strong> (HTTP, HTTPS, gRPC, WebSocket)</td><td><strong>3</strong> (IP packets, via GENEVE on port 6081)</td></tr>
<tr><td>Can see</td><td>IPs, ports, protocol (the 5-tuple)</td><td>Everything in HTTP: host, path, method, headers, query string, cookies, source IP</td><td>Whole IP packets</td></tr>
<tr><td>Routing decisions</td><td>Flow hash on the 5-tuple → target</td><td>Rules: <code>/api/*</code> → target group A; <code>Host: admin.*</code> → B; header-based, weighted, redirects, fixed responses</td><td>Sends all traffic through a fleet of virtual appliances (firewalls, IDS/IPS) and back</td></tr>
<tr><td>Connections</td><td>Pass-through: one flow end to end (TLS listener optional)</td><td>Proxy: terminates client connection, opens a new one to the target</td><td>Transparent "bump in the wire"</td></tr>
<tr><td>Client IP at target</td><td>Preserved by default for instance/IP targets (configurable)</td><td>In the <code>X-Forwarded-For</code> header</td><td>Preserved (original packet)</td></tr>
<tr><td>Signature strengths</td><td>Millions of requests/s, ultra-low latency, <strong>static IP per AZ</strong> / Elastic IP, non-HTTP protocols</td><td>Path/host routing, microservices, containers, Lambda targets, authentication (OIDC/Cognito), AWS WAF integration</td><td>Insert third-party security appliances transparently, at scale</td></tr>
</tbody></table>
<p>You will configure all three in M12. For now remember: <strong>"URL path", "host header", "HTTP"</strong> → ALB; <strong>"TCP/UDP", "static IP", "extreme performance"</strong> → NLB; <strong>"third-party virtual appliances", "inspect all traffic"</strong> → GWLB.</p>

<h3>Which AWS control works at which layer?</h3>
<table>
<thead><tr><th>Control</th><th>Layer(s)</th><th>What it can match on</th><th>Cannot do</th></tr></thead>
<tbody>
<tr><td><strong>Security group</strong> (per ENI)</td><td>3–4</td><td>Protocol, port range, source/destination CIDR, prefix list or another security group. <strong>Stateful</strong>, allow rules only.</td><td>Block a specific URL, SQL injection, or a single IP with a deny rule</td></tr>
<tr><td><strong>Network ACL</strong> (per subnet)</td><td>3–4</td><td>Protocol, port, CIDR. <strong>Stateless</strong>, numbered allow <em>and deny</em> rules.</td><td>Anything in HTTP</td></tr>
<tr><td><strong>AWS Network Firewall</strong> (per VPC)</td><td>3–7</td><td>Stateless and stateful rules, Suricata-compatible IPS signatures, domain (SNI/Host) allow/deny lists</td><td>Inspect inside TLS without TLS inspection configured</td></tr>
<tr><td><strong>AWS WAF</strong> (on CloudFront, ALB, API Gateway, AppSync, Cognito…)</td><td>7</td><td>HTTP: URI, query string, headers, body, SQL injection / XSS patterns, rate-based rules, geo and IP sets, bot control</td><td>Protect non-HTTP traffic (e.g. a game server on UDP)</td></tr>
<tr><td><strong>AWS Shield Standard</strong> (free, automatic)</td><td>3–4</td><td>Common volumetric and protocol DDoS (SYN floods, UDP reflection)</td><td>L7 floods (needs WAF and/or Shield Advanced)</td></tr>
<tr><td><strong>AWS Shield Advanced</strong> (paid)</td><td>3, 4, 7</td><td>Enhanced detection, the Shield Response Team, cost protection, automatic L7 mitigation with WAF</td><td>–</td></tr>
<tr><td><strong>CloudFront</strong></td><td>7</td><td>HTTP caching, header/cookie/query forwarding, edge functions</td><td>Non-HTTP protocols</td></tr>
<tr><td><strong>Global Accelerator</strong></td><td>4</td><td>Anycast static IPs, routes TCP/UDP over the AWS backbone to the closest healthy endpoint</td><td>Cache content, inspect HTTP</td></tr>
<tr><td><strong>VPC route tables / IGW / NAT gateway / Transit Gateway</strong></td><td>3</td><td>Destination CIDR → target</td><td>Filter by port (that is SGs/NACLs)</td></tr>
</tbody></table>

<h3>What AWS hides from you</h3>
<p>In a VPC, layers 1 and 2 are managed by AWS. You cannot sniff other tenants' traffic, there is no broadcast or multicast by default (Transit Gateway can do multicast), and ARP is answered by the VPC. Each <strong>ENI (elastic network interface)</strong> still has a MAC address, and <strong>Direct Connect</strong> is literally a physical (L1) fibre connection with 802.1Q VLANs (L2) on top, which is why Direct Connect questions mention "VLAN" and "virtual interfaces".</p>` },

    { type: "examples", title: "Worked examples: reading each layer", html: `
<h3>Example 1: see the layers in one <code>curl</code></h3>
<pre><code>$ curl -v https://example.com/ -o /dev/null
*   Trying 93.184.215.14:443...                       &lt;- L3 IP + L4 port chosen (after DNS, L7)
* Connected to example.com (93.184.215.14) port 443   &lt;- TCP 3-way handshake done (L4)
* ALPN: curl offers h2,http/1.1                        &lt;- TLS negotiates the L7 protocol
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384 &lt;- L6 encryption agreed
* Server certificate: subject: CN=www.example.org      &lt;- identity check
&gt; GET / HTTP/2                                         &lt;- L7 request line
&gt; Host: example.com                                    &lt;- L7 header an ALB could route on
&lt; HTTP/2 200                                           &lt;- L7 response
</code></pre>
<p>If curl stops at <em>Trying…</em>, the problem is at L3/L4 (route, security group, NACL, nothing listening). If it fails during the TLS lines, it's a certificate or TLS-version problem. If you get <code>HTTP 502</code> or <code>503</code>, the network is fine and the problem is at L7 (a proxy could not reach a healthy backend).</p>

<h3>Example 2: one packet, all the headers</h3>
<p>A request from an EC2 instance at <code>10.0.1.25</code> to an RDS PostgreSQL database at <code>10.0.3.40</code>:</p>
<table>
<thead><tr><th>Layer</th><th>Field</th><th>Value</th></tr></thead>
<tbody>
<tr><td>L2</td><td>Source MAC → destination MAC</td><td>ENI MAC of the instance → MAC of the VPC router (the subnet's +1 address)</td></tr>
<tr><td>L3</td><td>Source IP → destination IP, TTL</td><td>10.0.1.25 → 10.0.3.40, TTL 64 (Linux default)</td></tr>
<tr><td>L4</td><td>Protocol, source port → destination port</td><td>TCP, 49812 → 5432</td></tr>
<tr><td>L7</td><td>Data</td><td>PostgreSQL wire protocol (ideally inside TLS)</td></tr>
</tbody></table>
<p>The database's security group needs an inbound rule <em>TCP 5432 from the app tier's security group</em>. Because security groups are stateful, the reply to port 49812 is allowed automatically.</p>

<h3>Example 3: MTU arithmetic</h3>
<table>
<thead><tr><th>Path</th><th>MTU</th><th>IPv4 + TCP headers</th><th>MSS (data per segment)</th></tr></thead>
<tbody>
<tr><td>Internet / standard Ethernet</td><td>1500</td><td>20 + 20 = 40</td><td>1460</td></tr>
<tr><td>Inside a VPC with jumbo frames</td><td>9001</td><td>40</td><td>8961</td></tr>
<tr><td>Over an IPsec VPN (example)</td><td>~1400</td><td>40</td><td>~1360 (often clamped with "TCP MSS clamping" on the router)</td></tr>
</tbody></table>
<p>Moving 1 GB inside the VPC needs about 685,000 packets at 1500 bytes but only about 112,000 at 9001 bytes, so the CPU spends far less time on per-packet work.</p>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>Layer that matters</th><th>Choose</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Route <code>/api/*</code> to containers and <code>/images/*</code> to another fleet</td><td>7</td><td>ALB path-based rules</td><td>Only an L7 device can read the URL path</td></tr>
<tr><td>Multiplayer game server on UDP that needs a fixed IP for allow-listing</td><td>4</td><td>NLB (Elastic IP per AZ) or Global Accelerator</td><td>UDP is not HTTP; static IPs are an L3/L4 feature</td></tr>
<tr><td>Block SQL-injection attempts on a public web app</td><td>7</td><td>AWS WAF on the ALB or CloudFront</td><td>The attack is inside the HTTP body/query; SGs cannot see it</td></tr>
<tr><td>Block one abusive IP address quickly at the subnet edge</td><td>3</td><td>NACL deny rule (or a WAF IP set)</td><td>Security groups have no deny rules</td></tr>
<tr><td>All traffic must pass a third-party next-generation firewall appliance</td><td>3</td><td>Gateway Load Balancer + appliance fleet</td><td>Transparent L3 insertion with scaling and health checks</td></tr>
<tr><td>HPC cluster moving large datasets between instances</td><td>2/3</td><td>Cluster placement group + jumbo frames (MTU 9001)</td><td>Fewer, larger packets reduce overhead</td></tr>
</tbody></table>` },

    { type: "demo", title: "Try it: look at each layer on your own machine", html: `
<p>Run these on Linux, WSL or AWS CloudShell (free). Nothing here creates AWS resources.</p>
<pre><code># L2: your interfaces, MAC addresses and MTU
ip link show                  # look for "mtu 1500" and "link/ether xx:xx:..."

# L3: your IP addresses and routing table
ip addr show
ip route                      # "default via ..." is your default gateway

# L2/L3: the ARP / neighbour cache (IP -> MAC)
ip neigh

# L4: which processes are listening on which ports
ss -tulpn                     # t=TCP u=UDP l=listening p=process n=numeric

# L3 test: can I reach the host at all? (ICMP)
ping -c 3 1.1.1.1

# L4 test: is a TCP port open? (no data sent)
nc -vz example.com 443        # "succeeded" = L3 route + L4 listener OK

# L7 test: a full HTTP exchange
curl -sI https://example.com | head -5

# Path MTU test: largest unfragmented packet (1472 data + 28 ICMP/IP headers = 1500)
ping -c 2 -M do -s 1472 1.1.1.1   # works
ping -c 2 -M do -s 1500 1.1.1.1   # "message too long": exceeds 1500</code></pre>
<p class="muted small">In CloudShell, <code>ping</code> may be blocked; use <code>nc</code> and <code>curl</code> instead. On WSL2 the MTU may be shown as 1500 or lower depending on your host network.</p>` },

    { type: "casestudy", title: "Case study: \"the security group is fine, but the app is broken\"", html: `
<p><strong>Company:</strong> Northwind Parcel, a logistics firm running a tracking web app on EC2 behind an <strong>NLB</strong> in two AZs.</p>
<p><strong>Problem.</strong> After a marketing campaign, bots began hammering <code>/track?id=…</code> with random IDs and SQL-injection strings. The team added deny rules… and discovered that <em>security groups have no deny rules</em>. They then tried NACL denies, but the bots rotated through thousands of IPs. Meanwhile they also wanted <code>/admin</code> served only to the office.</p>
<p><strong>Analysis by layer.</strong></p>
<table>
<thead><tr><th>Requirement</th><th>Layer</th><th>Can the current design do it?</th></tr></thead>
<tbody>
<tr><td>Block SQL injection in query strings</td><td>7</td><td>No: NLB, SGs and NACLs stop at L4</td></tr>
<tr><td>Rate-limit per client IP</td><td>7 (HTTP request counting)</td><td>No</td></tr>
<tr><td>Route <code>/admin</code> differently</td><td>7</td><td>No: NLB can't see paths</td></tr>
<tr><td>Static IP for a partner's firewall allow-list</td><td>3/4</td><td>Yes: NLB Elastic IPs</td></tr>
</tbody></table>
<p><strong>Decision.</strong> They replaced the public NLB with an <strong>ALB</strong> and attached <strong>AWS WAF</strong> with the AWS managed SQL-injection rule group, a <strong>rate-based rule</strong> (block an IP that sends more than a set number of requests in 5 minutes) and an IP-set rule limiting <code>/admin</code> to the office range. For the one partner who required a fixed IP, they kept a small internal path: <strong>NLB → ALB</strong> (an ALB can be an NLB target), which keeps static IPs while still getting L7 features.</p>
<p><strong>Result.</strong> Malicious requests were blocked before reaching EC2; CPU on the fleet fell sharply; the partner kept its allow-list.</p>
<p><strong>Lessons learned.</strong></p>
<ul>
  <li>Before choosing a control, ask: <em>at what layer does the thing I want to match exist?</em></li>
  <li>"Static IP" and "L7 features" are not mutually exclusive: NLB in front of ALB, or Global Accelerator in front of ALB.</li>
  <li>Defence in depth: WAF at L7, security groups at L4, NACLs as a coarse subnet guard.</li>
</ul>` },

    { type: "exam", html: `
<table>
<thead><tr><th>Keyword in the stem</th><th>Points to</th></tr></thead>
<tbody>
<tr><td>"path-based", "host-based", "HTTP header", "query string", "cookie", "redirect HTTP to HTTPS"</td><td>ALB (L7)</td></tr>
<tr><td>"TCP/UDP", "non-HTTP protocol", "millions of requests per second", "ultra-low latency", "static IP / Elastic IP", "preserve source IP"</td><td>NLB (L4)</td></tr>
<tr><td>"third-party firewall/IDS appliances", "inspect all traffic transparently"</td><td>GWLB (L3)</td></tr>
<tr><td>"SQL injection", "cross-site scripting", "rate limit requests", "block by country"</td><td>AWS WAF (L7)</td></tr>
<tr><td>"DDoS protection" (basic, free)</td><td>Shield Standard; "DDoS response team / cost protection" → Shield Advanced</td></tr>
<tr><td>"deny a specific IP"</td><td>NACL deny rule or WAF IP set (<strong>not</strong> a security group)</td></tr>
<tr><td>"fixed IPs + global users + TCP/UDP"</td><td>Global Accelerator (L4, anycast)</td></tr>
</tbody></table>
<p><strong>Common distractors:</strong> a security group "deny rule" (doesn't exist); an NLB "routing by URL" (it can't see URLs); WAF on an NLB (not supported; WAF attaches to CloudFront, ALB, API Gateway, AppSync, Cognito user pools, App Runner and Verified Access).</p>` },

    { type: "architect", html: `
<ul>
  <li><strong>Troubleshoot bottom-up.</strong> L1/L2: is the instance running and the ENI attached? L3: route table, IGW/NAT, NACL, correct IP? L4: security group, process listening on the port (<code>ss -tlnp</code>)? L6: certificate valid, TLS version matches? L7: correct Host header, app logs, target health? VPC Flow Logs show <code>ACCEPT</code>/<code>REJECT</code> at L3/L4; ALB access logs show L7.</li>
  <li><strong>Every proxy hop is a new TCP connection.</strong> An ALB in front of your app means two connections, two sets of timeouts (ALB idle timeout default 60 s) and the real client IP only in <code>X-Forwarded-For</code>. Mismatched keep-alive timeouts (backend shorter than the ALB) cause intermittent 502s.</li>
  <li><strong>Don't block all ICMP.</strong> Allow at least ICMP "destination unreachable / fragmentation needed" so PMTUD works, especially over VPN and Direct Connect.</li>
  <li><strong>L7 inspection costs more.</strong> WAF charges per web ACL, per rule and per million requests; Network Firewall charges per endpoint-hour and per GB. Place them where they protect the most for the least traffic (for example WAF on CloudFront for a global site).</li>
  <li><strong>TLS hides L7 from the network.</strong> A Network Firewall without TLS inspection can match the SNI (server name) but not the URL path. If you need path-level control, terminate TLS at an ALB or CloudFront and use WAF.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>OSI has 7 layers (Physical, Data link, Network, Transport, Session, Presentation, Application); TCP/IP has 4 (Link, Internet, Transport, Application). People speak in OSI numbers.</li>
  <li>PDUs: bits (L1), frames (L2), packets (L3), segments/datagrams (L4), data (L5–7). Addresses: MAC (L2), IP (L3), port (L4), host/URL (L7).</li>
  <li>Encapsulation adds a header per layer on the way down; routers rewrite L2 at every hop and keep L3 end to end.</li>
  <li>A connection is identified by its 5-tuple. L4 devices work with the 5-tuple; L7 devices read HTTP.</li>
  <li>MTU is 1500 on the internet and up to 9001 (jumbo) inside a VPC; blocking all ICMP breaks Path MTU Discovery.</li>
  <li>ALB = L7 (path/host/header routing), NLB = L4 (TCP/UDP, static IPs, extreme performance), GWLB = L3 (appliance insertion).</li>
  <li>SGs and NACLs filter at L3–4, WAF at L7, Shield Standard at L3–4, Network Firewall at L3–7.</li>
  <li>Troubleshoot from the bottom of the stack up.</li>
</ul>` }
  ],
  drills: [
    { id: "M02.01-d1", q: "At which OSI layer (number) does a TCP port number live?", answers: ["4", "layer4", "l4"], placeholder: "e.g. 3", explain: "Ports are part of the TCP/UDP header: transport, layer 4." },
    { id: "M02.01-d2", q: "What is the PDU name at OSI layer 2?", answers: ["frame", "frames"], explain: "Layer 2 (data link) carries frames, addressed by MAC address." },
    { id: "M02.01-d3", q: "A device reads the HTTP <code>Host</code> header to decide where to send a request. At which OSI layer is it operating?", answers: ["7", "layer7", "l7"], explain: "HTTP headers exist only at the application layer." },
    { id: "M02.01-d4", q: "Standard Ethernet MTU is 1500. With 20-byte IPv4 and 20-byte TCP headers, what is the TCP MSS (bytes of data per segment)?", answers: ["1460"], hint: "MSS = MTU − IP header − TCP header.", explain: "1500 − 20 − 20 = 1460." },
    { id: "M02.01-d5", q: "Which layer (number) do VPC route tables operate at?", answers: ["3", "layer3", "l3"], explain: "Route tables match destination IP prefixes: network layer." },
    { id: "M02.01-d6", q: "How many layers does the TCP/IP (Internet protocol suite) model have?", answers: ["4", "four"], explain: "Link, Internet, Transport, Application." }
  ],
  check: [
    { id: "M02.01-k1", type: "single", domain: "D3", task: "3.4", level: 100,
      stem: "A company runs several microservices behind one public endpoint. Requests to <code>/orders/*</code> must go to one target group and <code>/users/*</code> to another. Which load balancer meets this requirement?",
      options: [
        { t: "Application Load Balancer", c: true, why: "ALB works at layer 7 and supports path-based routing rules to different target groups." },
        { t: "Network Load Balancer", c: false, why: "NLB works at layer 4 and only sees IPs and ports, not URL paths." },
        { t: "Gateway Load Balancer", c: false, why: "GWLB inserts virtual appliances at layer 3; it does not route by URL." },
        { t: "Classic Load Balancer with TCP listeners", c: false, why: "A TCP listener cannot read HTTP paths, and CLB has no path-based routing." }
      ] },
    { id: "M02.01-k2", type: "single", domain: "D3", task: "3.4", level: 200,
      stem: "A financial trading application uses a custom binary protocol over TCP. It needs extremely low latency, must handle sudden spikes of millions of requests per second, and partners must allow-list a fixed IP address per AZ. Which solution should a solutions architect choose?",
      options: [
        { t: "A Network Load Balancer with an Elastic IP address in each AZ", c: true, why: "NLB is an L4 load balancer for TCP/UDP with ultra-low latency and supports one static (Elastic) IP per AZ." },
        { t: "An Application Load Balancer with path-based routing", c: false, why: "ALB only handles HTTP/HTTPS/gRPC and has no static IPs of its own." },
        { t: "Amazon CloudFront with a custom origin", c: false, why: "CloudFront is an HTTP(S) CDN; it does not carry custom binary TCP protocols." },
        { t: "An Application Load Balancer protected by AWS WAF", c: false, why: "WAF inspects HTTP; neither it nor the ALB supports a custom TCP protocol or static IPs." }
      ] },
    { id: "M02.01-k3", type: "single", domain: "D1", task: "1.2", level: 200,
      stem: "A public web application behind an Application Load Balancer is receiving requests containing SQL-injection strings in the query string. Which service blocks these requests with the LEAST operational overhead?",
      options: [
        { t: "AWS WAF with the AWS managed SQL database rule group, associated with the ALB", c: true, why: "WAF inspects layer 7 content such as query strings; managed rule groups are maintained by AWS." },
        { t: "A deny rule in the instances' security group", c: false, why: "Security groups only have allow rules and only see layer 3–4 information." },
        { t: "A network ACL deny rule for port 443", c: false, why: "That would block all HTTPS traffic; NACLs can't read the query string." },
        { t: "AWS Shield Standard", c: false, why: "Shield Standard protects against L3/L4 DDoS, not application-layer injection attacks." }
      ] },
    { id: "M02.01-k4", type: "multi", domain: "D1", task: "1.2", level: 200,
      stem: "Which of the following AWS controls make decisions using ONLY layer 3 and layer 4 information (IP addresses, protocols and ports)?",
      options: [
        { t: "Security groups", c: true, why: "SG rules match protocol, port and source/destination (CIDR, prefix list or security group)." },
        { t: "Network ACLs", c: true, why: "NACL rules match protocol, port range and CIDR, with no visibility into application data." },
        { t: "AWS WAF", c: false, why: "WAF inspects HTTP requests (layer 7): URIs, headers, bodies." },
        { t: "Application Load Balancer listener rules", c: false, why: "ALB rules match host, path, headers and other HTTP attributes (layer 7)." }
      ] },
    { id: "M02.01-k5", type: "single", domain: "D2", task: "2.2", level: 200,
      stem: "Users connected over a Site-to-Site VPN can log in to an application, but large file downloads hang. Small requests work. A firewall on the path blocks all ICMP. What is the MOST likely cause?",
      options: [
        { t: "Path MTU Discovery is broken because ICMP \"fragmentation needed\" messages are blocked", c: true, why: "The tunnel lowers the MTU; without ICMP feedback, large packets are silently dropped while small ones fit." },
        { t: "The security group does not allow port 443", c: false, why: "Then nothing would work, including logins." },
        { t: "DNS TTL is too long", c: false, why: "DNS affects name resolution, not packet size." },
        { t: "The VPN uses UDP instead of TCP", c: false, why: "IPsec commonly uses UDP 500/4500 for NAT traversal; that does not cause size-dependent failures." }
      ] }
  ],
  cards: ["fc-M02-1-01", "fc-M02-1-02", "fc-M02-1-03", "fc-M02-1-04", "fc-M02-1-05", "fc-M02-1-06", "fc-M02-1-07", "fc-M02-1-08", "fc-M02-1-09", "fc-M02-1-10"],
  references: [
    "<em>System Design on AWS</em> ch.6 \"Communication Networks &amp; Protocols\" (PDF p247–299)",
    "<em>System Design on AWS</em> ch.5 \"Networking Components\" (PDF p215)",
    "Elastic Load Balancing User Guide: \"Comparison of Elastic Load Balancing products\"",
    "Amazon EC2 User Guide: \"Network maximum transmission unit (MTU) for your EC2 instance\"",
    "AWS WAF, AWS Firewall Manager and AWS Shield Advanced Developer Guide"
  ]
});

FLASHCARDS.push(
  { id: "fc-M02-1-01", front: "The 7 OSI layers, bottom to top?", back: "1 Physical · 2 Data link · 3 Network · 4 Transport · 5 Session · 6 Presentation · 7 Application (\"Please Do Not Throw Sausage Pizza Away\")." },
  { id: "fc-M02-1-02", front: "PDU names at L1, L2, L3, L4?", back: "Bits · frames · packets · segments (TCP) / datagrams (UDP). Above L4: data." },
  { id: "fc-M02-1-03", front: "Address used at L2, L3, L4, L7?", back: "MAC address · IP address · port · hostname / URL / headers." },
  { id: "fc-M02-1-04", front: "The 4 TCP/IP layers and their OSI equivalents?", back: "Link (1–2) · Internet (3) · Transport (4) · Application (5–7)." },
  { id: "fc-M02-1-05", front: "What is the 5-tuple?", back: "Protocol, source IP, source port, destination IP, destination port. It identifies a flow for firewalls, NAT and L4 load balancers." },
  { id: "fc-M02-1-06", front: "ALB vs NLB vs GWLB layers?", back: "ALB = L7 (HTTP/HTTPS/gRPC, path/host routing). NLB = L4 (TCP/UDP/TLS, static IP per AZ, ultra-low latency). GWLB = L3 (third-party appliances, GENEVE 6081)." },
  { id: "fc-M02-1-07", front: "Standard MTU vs VPC jumbo MTU?", back: "1500 bytes on the internet; up to 9001 bytes between instances inside a VPC. Traffic leaving the VPC (IGW, VPN) is 1500 or less." },
  { id: "fc-M02-1-08", front: "Why should you not block all ICMP?", back: "Path MTU Discovery needs ICMP \"fragmentation needed\" / \"packet too big\". Without it, large packets are dropped silently (black-hole connections)." },
  { id: "fc-M02-1-09", front: "Which layer do SGs/NACLs, WAF and Shield Standard work at?", back: "SGs and NACLs: L3–4. WAF: L7. Shield Standard: L3–4. Network Firewall: L3–7." },
  { id: "fc-M02-1-10", front: "How does an app behind an ALB learn the client's IP?", back: "From the X-Forwarded-For HTTP header (the ALB opens a new connection, so the packet source is the ALB)." }
);

  // ================================================================== 02_cidr.js
/* ================================================================ M02.02 IP addressing and CIDR */
var DG_0202_VPC = `
<figure>
<svg class="diagram" viewBox="0 0 760 360" role="img" aria-labelledby="m0202at m0202ad">
  <title id="m0202at">A 10.0.0.0/16 VPC carved into subnets across three Availability Zones</title>
  <desc id="m0202ad">The VPC 10.0.0.0/16 has three tiers in each of three AZs: public /22 subnets, private application /20 subnets and data /22 subnets, leaving 10.0.76.0 to 10.0.255.255 free for growth.</desc>
  <rect class="dg-region" x="10" y="10" width="740" height="340" rx="14"/>
  <text class="dg-ta" x="24" y="34">VPC 10.0.0.0/16 · 65,536 addresses · eu-west-1</text>

  <rect class="dg-az" x="24" y="46" width="230" height="250" rx="10"/><text class="dg-tb" x="36" y="68">AZ a</text>
  <rect class="dg-az" x="266" y="46" width="230" height="250" rx="10"/><text class="dg-tb" x="278" y="68">AZ b</text>
  <rect class="dg-az" x="508" y="46" width="230" height="250" rx="10"/><text class="dg-tb" x="520" y="68">AZ c</text>

  <rect class="dg-edge" x="36" y="80" width="206" height="56" rx="6"/>
  <text class="dg-t" x="46" y="102">Public 10.0.0.0/22</text><text class="dg-ts" x="46" y="122">1,019 usable · ALB, NAT GW</text>
  <rect class="dg-edge" x="278" y="80" width="206" height="56" rx="6"/>
  <text class="dg-t" x="288" y="102">Public 10.0.4.0/22</text><text class="dg-ts" x="288" y="122">1,019 usable</text>
  <rect class="dg-edge" x="520" y="80" width="206" height="56" rx="6"/>
  <text class="dg-t" x="530" y="102">Public 10.0.8.0/22</text><text class="dg-ts" x="530" y="122">1,019 usable</text>

  <rect class="dg-info" x="36" y="146" width="206" height="66" rx="6"/>
  <text class="dg-t" x="46" y="170">App 10.0.16.0/20</text><text class="dg-ts" x="46" y="190">4,091 usable · EC2, EKS pods</text>
  <rect class="dg-info" x="278" y="146" width="206" height="66" rx="6"/>
  <text class="dg-t" x="288" y="170">App 10.0.32.0/20</text><text class="dg-ts" x="288" y="190">4,091 usable</text>
  <rect class="dg-info" x="520" y="146" width="206" height="66" rx="6"/>
  <text class="dg-t" x="530" y="170">App 10.0.48.0/20</text><text class="dg-ts" x="530" y="190">4,091 usable</text>

  <rect class="dg-good" x="36" y="222" width="206" height="56" rx="6"/>
  <text class="dg-t" x="46" y="244">Data 10.0.64.0/22</text><text class="dg-ts" x="46" y="264">RDS, ElastiCache</text>
  <rect class="dg-good" x="278" y="222" width="206" height="56" rx="6"/>
  <text class="dg-t" x="288" y="244">Data 10.0.68.0/22</text><text class="dg-ts" x="288" y="264">RDS standby</text>
  <rect class="dg-good" x="520" y="222" width="206" height="56" rx="6"/>
  <text class="dg-t" x="530" y="244">Data 10.0.72.0/22</text><text class="dg-ts" x="530" y="264">read replica</text>

  <rect class="dg-box" x="24" y="306" width="714" height="34" rx="6"/>
  <text class="dg-t" x="36" y="328">Free: 10.0.76.0 – 10.0.255.255 (≈ 46,000 addresses) for new tiers, a 4th AZ, EKS growth</text>
</svg>
<figcaption>Figure M02-3. One VPC, three tiers, three AZs. Each subnet lives in exactly one AZ; sizes follow how many IPs each tier will really consume.</figcaption>
</figure>`;

LESSONS.push({
  id: "M02.02", title: "IP addressing and CIDR", level: 200, minutes: 60,
  objectives: [
    "Convert IPv4 addresses between dotted decimal and binary, and split them into network and host bits",
    "Calculate the size, network address, broadcast address and AWS-usable addresses of any CIDR block",
    "Subnet a VPC range into per-AZ, per-tier subnets without overlap, and summarise contiguous ranges",
    "Recognise private, shared, link-local and public ranges, and explain why overlapping CIDRs break connectivity",
    "Describe IPv6 addressing on AWS (/56 VPC, /64 subnets, dual-stack, egress-only internet gateway)"
  ],
  sections: [
    { type: "why", html: `
<p>Creating a VPC is the first thing you do in almost every AWS design, and the first question the console asks is <strong>"IPv4 CIDR block"</strong>. That choice is hard to undo: a subnet can never be resized, and two networks with overlapping ranges can <strong>never</strong> be connected by VPC peering, and are very painful to connect through Transit Gateway or VPN.</p>
<p>Real teams get burned by this. Every team creates its VPC with the default-looking <code>10.0.0.0/16</code>; a year later the company wants to connect them all, plus the on-premises network, and nothing can route. Re-addressing a live production network can take months. A good IP plan, done on day one, costs an hour.</p>
<p>On the exam, CIDR math is tested directly ("how many IPs are available in this subnet?") and indirectly ("the VPCs can't be peered: why?"). This lesson gives you the method to answer both in under a minute.</p>` },

    { type: "concept", html: `
<h3>1. An IPv4 address is a 32-bit number</h3>
<p>An IPv4 address such as <code>10.0.37.200</code> is just 32 bits written as four 8-bit <strong>octets</strong> in decimal (0–255), separated by dots. That's about 4.3 billion (2<sup>32</sup>) possible addresses.</p>
<p>Each bit in an octet has a place value:</p>
<table>
<thead><tr><th>Bit</th><th>1st (left)</th><th>2nd</th><th>3rd</th><th>4th</th><th>5th</th><th>6th</th><th>7th</th><th>8th</th></tr></thead>
<tbody><tr><td>Value</td><td>128</td><td>64</td><td>32</td><td>16</td><td>8</td><td>4</td><td>2</td><td>1</td></tr></tbody>
</table>
<p>So <code>200</code> = 128 + 64 + 8 = <code>11001000</code>, and <code>37</code> = 32 + 4 + 1 = <code>00100101</code>. The full address:</p>
<pre><code>10       .0        .37       .200
00001010 .00000000 .00100101 .11001000</code></pre>

<h3>2. Network bits and host bits</h3>
<p>Every address is split into two parts:</p>
<ul>
  <li>the <strong>network portion</strong> (the leftmost bits), which is the same for every device on the network, like a street name;</li>
  <li>the <strong>host portion</strong> (the remaining bits), which identifies one device, like a house number.</li>
</ul>
<p>Where the split happens is given by the <strong>prefix length</strong> or the <strong>subnet mask</strong>.</p>

<h3>3. CIDR notation and subnet masks</h3>
<p><strong>CIDR (Classless Inter-Domain Routing)</strong> writes a network as <code>address/prefix</code>. The prefix (0–32) says how many leading bits are the network portion. <code>10.0.0.0/16</code> means "the first 16 bits are fixed (<code>10.0</code>), the last 16 bits are free for hosts".</p>
<p>A <strong>subnet mask</strong> says the same thing in dotted decimal: 1s for network bits, 0s for host bits. <code>/16</code> = <code>11111111.11111111.00000000.00000000</code> = <code>255.255.0.0</code>.</p>
<p>Before CIDR (1993) the internet used fixed <em>classes</em> (Class A = /8, B = /16, C = /24). Classes wasted huge numbers of addresses; CIDR allows any prefix length. You may still hear "a class C" to mean "a /24".</p>

<h3>4. The one formula you need</h3>
<div class="callout tip"><strong>Number of addresses in a /n = 2<sup>(32 − n)</sup></strong>. Each step of one bit doubles or halves the size: a /23 is twice a /24; a /25 is half.</div>
<table>
<thead><tr><th>Prefix</th><th>Mask</th><th>Addresses</th><th>Usable (traditional, −2)</th><th>Usable in an AWS subnet (−5)</th><th>Typical use</th></tr></thead>
<tbody>
<tr><td>/8</td><td>255.0.0.0</td><td>16,777,216</td><td>16,777,214</td><td>–</td><td>Whole 10.0.0.0/8 company plan</td></tr>
<tr><td>/16</td><td>255.255.0.0</td><td>65,536</td><td>65,534</td><td>– (largest VPC block)</td><td>One VPC</td></tr>
<tr><td>/19</td><td>255.255.224.0</td><td>8,192</td><td>8,190</td><td>8,187</td><td>Large EKS subnet</td></tr>
<tr><td>/20</td><td>255.255.240.0</td><td>4,096</td><td>4,094</td><td>4,091</td><td>Private app subnet</td></tr>
<tr><td>/21</td><td>255.255.248.0</td><td>2,048</td><td>2,046</td><td>2,043</td><td></td></tr>
<tr><td>/22</td><td>255.255.252.0</td><td>1,024</td><td>1,022</td><td>1,019</td><td></td></tr>
<tr><td>/23</td><td>255.255.254.0</td><td>512</td><td>510</td><td>507</td><td></td></tr>
<tr><td>/24</td><td>255.255.255.0</td><td>256</td><td>254</td><td>251</td><td>Classic "small subnet"</td></tr>
<tr><td>/25</td><td>255.255.255.128</td><td>128</td><td>126</td><td>123</td><td></td></tr>
<tr><td>/26</td><td>255.255.255.192</td><td>64</td><td>62</td><td>59</td><td></td></tr>
<tr><td>/27</td><td>255.255.255.224</td><td>32</td><td>30</td><td>27</td><td></td></tr>
<tr><td>/28</td><td>255.255.255.240</td><td>16</td><td>14</td><td>11</td><td>Smallest VPC/subnet; TGW attachment subnets</td></tr>
<tr><td>/32</td><td>255.255.255.255</td><td>1</td><td>–</td><td>–</td><td>A single host in a security group or route</td></tr>
<tr><td>/0</td><td>0.0.0.0</td><td>all</td><td>–</td><td>–</td><td><code>0.0.0.0/0</code> = "anywhere" (default route)</td></tr>
</tbody></table>
<p>Mask octet values to memorise (the number of 1-bits from the left): <code>128</code> (1), <code>192</code> (2), <code>224</code> (3), <code>240</code> (4), <code>248</code> (5), <code>252</code> (6), <code>254</code> (7), <code>255</code> (8).</p>

<h3>5. Network address and broadcast address</h3>
<ul>
  <li><strong>Network address</strong>: all host bits = 0. It names the network (<code>10.0.32.0/20</code>).</li>
  <li><strong>Broadcast address</strong>: all host bits = 1. The last address in the block (<code>10.0.47.255</code> for <code>10.0.32.0/20</code>).</li>
  <li>A CIDR block is only "valid" if its address <em>is</em> the network address: <code>10.0.37.0/20</code> is not a proper block, because the /20 containing it starts at <code>10.0.32.0</code>. AWS rejects such blocks.</li>
</ul>

<h3>6. Special and private ranges</h3>
<table>
<thead><tr><th>Range</th><th>Name</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><code>10.0.0.0/8</code></td><td>RFC 1918 private</td><td>10.0.0.0 – 10.255.255.255. The usual choice for large cloud estates.</td></tr>
<tr><td><code>172.16.0.0/12</code></td><td>RFC 1918 private</td><td>172.16.0.0 – <strong>172.31.255.255</strong> (not 172.16.x only!). The AWS <em>default VPC</em> uses <code>172.31.0.0/16</code>. Docker's default bridge is <code>172.17.0.0/16</code>.</td></tr>
<tr><td><code>192.168.0.0/16</code></td><td>RFC 1918 private</td><td>Home routers, many small offices.</td></tr>
<tr><td><code>100.64.0.0/10</code></td><td>RFC 6598 shared (carrier-grade NAT)</td><td>Used by ISPs; AWS allows it as a VPC range and it is popular as a secondary CIDR for EKS pods.</td></tr>
<tr><td><code>169.254.0.0/16</code></td><td>Link-local</td><td>Never routed. On EC2: <code>169.254.169.254</code> = instance metadata service (IMDS), <code>169.254.169.253</code> = Amazon DNS, <code>169.254.169.123</code> = time sync. Also used inside VPN tunnels (/30 inside addresses).</td></tr>
<tr><td><code>127.0.0.0/8</code></td><td>Loopback</td><td><code>127.0.0.1</code> = "this machine".</td></tr>
<tr><td><code>0.0.0.0/0</code></td><td>Default / any</td><td>In a route table: "everything else". In a security group: "any address".</td></tr>
<tr><td>Everything else (mostly)</td><td>Public</td><td>Globally unique, routable on the internet, assigned by registries to ISPs and companies (and to AWS, which hands them out as public IPs and Elastic IPs).</td></tr>
</tbody></table>
<p><strong>Private addresses</strong> are not routed on the public internet; any organisation can reuse them. To reach the internet, a private address must be translated to a public one by NAT (M02.03). This is why overlaps happen: everyone picks <code>10.0.0.0/16</code>.</p>

<h3>7. Subnetting, VLSM and summarisation</h3>
<p><strong>Subnetting</strong> means borrowing host bits to create several smaller networks from one bigger block. Taking a /16 and using /20 subnets borrows 4 bits, so you get 2<sup>4</sup> = 16 subnets of 4,096 addresses each.</p>
<p><strong>VLSM (variable-length subnet masking)</strong> means the subnets don't all have to be the same size: big /20s for the app tier, smaller /22s for public and data tiers (as in Figure M02-3). Rule: allocate the <em>largest</em> subnets first, each on a boundary that is a multiple of its own size, so the blocks never collide.</p>
<p><strong>Summarisation (supernetting)</strong> is the reverse: describing contiguous blocks with one shorter prefix. <code>192.168.0.0/24</code> + <code>.1.0/24</code> + <code>.2.0/24</code> + <code>.3.0/24</code> = <code>192.168.0.0/22</code>. One route instead of four keeps route tables small (VPN and Direct Connect have route limits) and makes security rules simpler.</p>
` + DG_0202_VPC + `
<h3>8. Overlap: the silent design killer</h3>
<p>Two CIDR blocks <strong>overlap</strong> if any address belongs to both. <code>10.0.0.0/16</code> and <code>10.0.128.0/17</code> overlap (the /17 is inside the /16). <code>10.0.0.0/16</code> and <code>10.1.0.0/16</code> do not.</p>
<p>Why it matters: routing chooses a next hop by destination address. If <code>10.0.5.9</code> exists both in your VPC and in the network you want to reach, the router can't tell which one you mean. On AWS:</p>
<ul>
  <li><strong>VPC peering</strong> cannot be created between VPCs with overlapping CIDRs.</li>
  <li><strong>Transit Gateway</strong> and <strong>VPN/Direct Connect</strong> will accept the attachments, but traffic to the overlapping range can only go one way. You need NAT tricks (for example a private NAT gateway) or re-addressing.</li>
  <li>Local VPC routes always win: the VPC's own CIDR can't be overridden by a more general route to on-premises.</li>
</ul>

<h3>9. IPv6 basics</h3>
<p>IPv6 addresses are <strong>128 bits</strong>, written as eight groups of four hexadecimal digits: <code>2001:0db8:1234:5600:0000:0000:0000:0001</code>.</p>
<ul>
  <li><strong>Compression rules:</strong> drop leading zeros in each group (<code>0db8</code> → <code>db8</code>), and replace <em>one</em> run of all-zero groups with <code>::</code>. The example becomes <code>2001:db8:1234:5600::1</code>.</li>
  <li><strong>Scale:</strong> a single /64 subnet has 2<sup>64</sup> ≈ 18 quintillion addresses. Address exhaustion is not a concern, so there is <strong>no need for NAT</strong>.</li>
  <li><strong>Types:</strong> <em>global unicast</em> (<code>2000::/3</code>, publicly routable), <em>link-local</em> (<code>fe80::/10</code>), <em>unique local</em> (<code>fc00::/7</code>, roughly IPv6's private range), loopback <code>::1</code>.</li>
  <li><strong>Dual-stack:</strong> a resource with both an IPv4 and an IPv6 address. This is the normal migration path.</li>
</ul>` },

    { type: "workflow", title: "The subnetting method, step by step", html: `
<p>Use this for any question of the form "which network is this address in, and what are its first and last addresses?". Example: <strong>10.0.37.200/20</strong>.</p>
<ol class="flow">
  <li><strong>Find the "interesting" octet.</strong> The prefix tells you which octet the boundary falls in: /1–/8 → 1st, /9–/16 → 2nd, /17–/24 → 3rd, /25–/32 → 4th. For /20 it's the <strong>3rd octet</strong> (20 − 16 = 4 network bits in it).</li>
  <li><strong>Find the block size (the "magic number").</strong> Block size = 256 − mask value in that octet, or 2<sup>(bits left in the octet)</sup>. /20 → mask octet 240 → <strong>256 − 240 = 16</strong> (or 2<sup>8−4</sup> = 16). Networks in the 3rd octet start at 0, 16, 32, 48, 64…</li>
  <li><strong>Find the network address.</strong> Take the largest multiple of the block size that is ≤ the address's octet: 37 → <strong>32</strong>. Octets to the left stay, octets to the right become 0: <strong>10.0.32.0</strong>.</li>
  <li><strong>Find the broadcast address.</strong> Next network − 1: next block starts at 48, so the broadcast is <strong>10.0.47.255</strong> (octets to the right become 255).</li>
  <li><strong>Count addresses.</strong> 2<sup>(32−20)</sup> = <strong>4,096</strong>. In AWS, usable = 4,096 − 5 = <strong>4,091</strong>.</li>
  <li><strong>List the AWS-reserved addresses.</strong> 10.0.32.0 (network), 10.0.32.1 (VPC router), 10.0.32.2 (DNS), 10.0.32.3 (reserved), 10.0.47.255 (broadcast). First assignable: <strong>10.0.32.4</strong>; last: <strong>10.0.47.254</strong>.</li>
</ol>
<p><strong>Check in binary</strong> (the method is a shortcut for this):</p>
<pre><code>address   10.0.37.200   00001010.00000000.0010|0101.11001000
mask /20  255.255.240.0 11111111.11111111.1111|0000.00000000
AND     = network       00001010.00000000.0010|0000.00000000  = 10.0.32.0
host bits all 1s        00001010.00000000.0010|1111.11111111  = 10.0.47.255</code></pre>

<h3>Carving a VPC: the planning workflow</h3>
<ol class="flow">
  <li><strong>Count the AZs</strong> you'll use (usually 3) and the <strong>tiers</strong> (public, private app, data, maybe a TGW attachment tier).</li>
  <li><strong>Estimate IPs per subnet</strong> with growth: instances, containers/pods (EKS gives each pod a VPC IP!), Lambda ENIs, load balancer nodes, interface endpoints. Multiply by 2–4× for growth and blue/green deployments.</li>
  <li><strong>Round up</strong> to a power of two plus the 5 reserved (need 500 → /23 gives 507).</li>
  <li><strong>Allocate largest first</strong>, each on its own boundary, keeping tiers in contiguous ranges so each tier can be summarised (e.g. all app subnets inside <code>10.0.16.0/20 – 10.0.48.0/20</code> = <code>10.0.0.0/18</code> minus the first /20).</li>
  <li><strong>Leave free space</strong> for a 4th AZ and new tiers. Unused IPs in a VPC cost nothing.</li>
  <li><strong>Record the plan</strong> (spreadsheet, IaC variables or AWS IPAM) so nobody reuses a range.</li>
</ol>` },

    { type: "aws", title: "IP addressing on AWS", html: `
<h3>VPC CIDR rules</h3>
<ul>
  <li>A VPC's IPv4 block must be between <strong>/16 (65,536 addresses) and /28 (16 addresses)</strong>.</li>
  <li>Use RFC 1918 ranges (or 100.64.0.0/10). You <em>can</em> use a public range you don't own, but then you can't reach the real owners of those addresses on the internet. Don't.</li>
  <li>The primary CIDR can't be changed after creation. You <strong>can add secondary CIDR blocks</strong> (a small number by default; the quota is adjustable) to grow a VPC, with some restrictions on which ranges can be combined.</li>
  <li>Each <strong>subnet</strong> takes a block from the VPC's CIDR, lives in <strong>one AZ</strong>, is also between /16 and /28, can't overlap other subnets, and <strong>can't be resized</strong>. To "resize", create a new subnet and migrate.</li>
</ul>

<h3>The 5 reserved addresses in every subnet</h3>
<p>For subnet <code>10.0.1.0/24</code>:</p>
<table>
<thead><tr><th>Address</th><th>Reserved for</th></tr></thead>
<tbody>
<tr><td><code>10.0.1.0</code></td><td>Network address</td></tr>
<tr><td><code>10.0.1.1</code></td><td>The VPC router (your instances' default gateway)</td></tr>
<tr><td><code>10.0.1.2</code></td><td>The Amazon-provided DNS server (strictly, the DNS server is at the VPC base + 2; AWS reserves +2 in every subnet)</td></tr>
<tr><td><code>10.0.1.3</code></td><td>Reserved by AWS for future use</td></tr>
<tr><td><code>10.0.1.255</code></td><td>Network broadcast address (VPCs don't support broadcast, so AWS reserves it)</td></tr>
</tbody></table>
<div class="callout"><strong>Usable IPs in an AWS subnet = 2<sup>(32 − prefix)</sup> − 5.</strong> A /24 gives 251; a /28 gives 11. This exact number is a favourite exam question.</div>

<h3>Private, public and Elastic IPs on instances</h3>
<ul>
  <li>Every ENI gets a <strong>primary private IPv4 address</strong> from its subnet (kept for the life of the ENI). You can add secondary private IPs or delegate whole prefixes (/28) to an ENI for containers.</li>
  <li>A <strong>public IPv4 address</strong> can be auto-assigned at launch in a public subnet. It comes from Amazon's pool and <strong>changes when you stop and start</strong> the instance. The instance OS never sees it: the internet gateway does a 1:1 NAT between public and private IP.</li>
  <li>An <strong>Elastic IP</strong> is a static public IPv4 address you allocate to your account and associate with an instance, ENI or NAT gateway. AWS charges for all public IPv4 addresses (in use or idle), so use them deliberately.</li>
</ul>

<h3>IPv6 on AWS</h3>
<ul>
  <li>A VPC gets an IPv6 block, by default an Amazon-provided <strong>/56</strong> (you can also bring your own or allocate from IPAM). Each subnet uses a <strong>/64</strong>, so a /56 holds 256 subnets.</li>
  <li>Amazon-provided IPv6 addresses are <strong>globally unique public addresses</strong>. There's no NAT. Whether something is reachable from the internet is decided purely by routing and security groups.</li>
  <li>For IPv6 instances in private subnets that must reach out but never be reached, use an <strong>egress-only internet gateway</strong> (IPv6's equivalent of a NAT gateway: stateful, outbound-initiated only).</li>
  <li>Dual-stack VPCs and subnets are common; IPv6-only subnets also exist (with DNS64/NAT64 to talk to IPv4-only services).</li>
</ul>

<h3>Planning at scale: Amazon VPC IPAM</h3>
<p><strong>VPC IP Address Manager (IPAM)</strong> lets you create <em>pools</em> (for example "10.0.0.0/8 → per-Region pools → per-environment pools"), allocate VPC CIDRs automatically from them across all accounts in an AWS Organization, enforce allocation rules (such as "VPCs must be /16"), and monitor usage and overlaps. It is the AWS answer to "prevent teams from creating overlapping VPCs".</p>` },

    { type: "examples", title: "Worked examples", html: `
<h3>Example 1: how many usable IPs?</h3>
<p><em>"A subnet is 10.0.0.0/27. How many IPs can be assigned to instances?"</em></p>
<p>2<sup>(32−27)</sup> = 2<sup>5</sup> = 32 addresses; 32 − 5 = <strong>27</strong> usable in AWS (30 in a traditional network).</p>

<h3>Example 2: network and broadcast for 172.16.5.130/26</h3>
<pre><code>/26 → interesting octet is the 4th (26 − 24 = 2 bits)
mask octet = 192 → block size = 256 − 192 = 64
networks in the 4th octet: 0, 64, 128, 192
130 falls in 128–191
network   = 172.16.5.128
broadcast = 172.16.5.191
AWS first usable = 172.16.5.132   last usable = 172.16.5.190
binary check: 130 = 10|000010  → host bits (6) zeroed = 10|000000 = 128</code></pre>

<h3>Example 3: split a /16 into /20s</h3>
<p>Borrow 4 bits (20 − 16) → 2<sup>4</sup> = 16 subnets. Block size in the 3rd octet = 16:</p>
<pre><code>10.0.0.0/20    10.0.16.0/20   10.0.32.0/20   10.0.48.0/20
10.0.64.0/20   10.0.80.0/20   10.0.96.0/20   10.0.112.0/20
10.0.128.0/20  ...            ...            10.0.240.0/20   (16 in total)</code></pre>
<p>And how many /24s fit in one /20? 2<sup>(24−20)</sup> = <strong>16</strong>.</p>

<h3>Example 4: right-size a subnet</h3>
<p><em>"An EKS node group will run up to 450 pods per AZ, plus 20 nodes, plus room to double."</em> Need ≈ (450 + 20) × 2 = 940 IPs. A /23 gives 507 (too small); a /22 gives <strong>1,019</strong> → choose <strong>/22</strong>. If you expect to scale further, /21 (2,043) or /20 (4,091).</p>

<h3>Example 5: does it overlap?</h3>
<table>
<thead><tr><th>Block A</th><th>Block B</th><th>Overlap?</th><th>Reasoning</th></tr></thead>
<tbody>
<tr><td>10.0.0.0/16</td><td>10.1.0.0/16</td><td>No</td><td>A = 10.0.0.0–10.0.255.255; B starts at 10.1.0.0</td></tr>
<tr><td>10.0.0.0/16</td><td>10.0.128.0/17</td><td>Yes</td><td>B = 10.0.128.0–10.0.255.255, fully inside A</td></tr>
<tr><td>10.0.0.0/22</td><td>10.0.3.0/24</td><td>Yes</td><td>A = 10.0.0.0–10.0.3.255, which contains 10.0.3.x</td></tr>
<tr><td>172.31.0.0/16 (default VPC)</td><td>172.16.0.0/16 (office)</td><td>No</td><td>Different /16s, both inside 172.16.0.0/12</td></tr>
</tbody></table>
<p>Quick method: write both as first–last ranges; they overlap if <em>A.first ≤ B.last</em> and <em>B.first ≤ A.last</em>.</p>

<h3>Example 6: summarise routes</h3>
<p>On-premises advertises <code>192.168.0.0/24</code>, <code>192.168.1.0/24</code>, <code>192.168.2.0/24</code> and <code>192.168.3.0/24</code>. In binary the 3rd octets are 000000<u>00</u>, 000000<u>01</u>, 000000<u>10</u>, 000000<u>11</u>: the first 22 bits match. Summary: <strong>192.168.0.0/22</strong>. One route in the VPC route table instead of four.</p>

<h3>Example 7: verify your math with tools</h3>
<pre><code>$ python3 -c "import ipaddress as i; n=i.ip_network('10.0.32.0/20'); print(n.netmask, n.num_addresses, n[1], n[-1])"
255.255.240.0 4096 10.0.32.1 10.0.47.255

$ python3 -c "import ipaddress as i; print(i.ip_interface('10.0.37.200/20').network)"
10.0.32.0/20

$ ipcalc 10.0.37.200/20        # if installed: sudo apt install ipcalc</code></pre>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>Choice</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Small test VPC that will never connect to anything</td><td><code>/24</code> VPC, a /26 or /27 per subnet</td><td>Cheap mentally; but even "never" often changes, so still avoid clashing ranges</td></tr>
<tr><td>Production VPC for a growing product with EKS</td><td><code>/16</code> VPC (or /16 + 100.64.0.0/16 secondary for pods)</td><td>Pods each take a VPC IP; IP exhaustion is a top EKS outage cause</td></tr>
<tr><td>Company with 40 AWS accounts and an on-prem data centre on 10.10.0.0/16</td><td>A central 10.0.0.0/8 plan in AWS IPAM, excluding 10.10.0.0/16</td><td>Guarantees non-overlap for peering, TGW and VPN</td></tr>
<tr><td>Partner integration where both sides use 10.0.0.0/16</td><td>Private NAT gateway or PrivateLink</td><td>Overlap can't be routed; PrivateLink exposes a service without routing the networks</td></tr>
<tr><td>Mobile/IoT backend that must scale to huge numbers of devices</td><td>Dual-stack VPC, IPv6 for clients</td><td>No address exhaustion, no NAT, lower public-IPv4 cost</td></tr>
<tr><td>Transit Gateway attachments</td><td>A dedicated <code>/28</code> subnet per AZ</td><td>TGW ENIs need few IPs; keeps attachment routing separate</td></tr>
</tbody></table>` },

    { type: "demo", title: "Try it: calculate, then confirm in the CLI", html: `
<p>Calculate first on paper, then check. All commands are free (CloudShell or a Linux/WSL shell).</p>
<pre><code># 1) Python's ipaddress module is a perfect CIDR calculator
python3 - &lt;&lt;'PY'
import ipaddress as ip
vpc = ip.ip_network("10.0.0.0/16")
for s in list(vpc.subnets(new_prefix=20))[:4]:
    print(s, "aws-usable:", s.num_addresses - 5, "first:", s[4], "last:", s[-2])
print(ip.ip_network("10.0.0.0/16").overlaps(ip.ip_network("10.0.128.0/17")))   # True
print(list(ip.collapse_addresses(ip.ip_network(f"192.168.{i}.0/24") for i in range(4))))
PY

# 2) Look at your default VPC and subnets (read-only)
aws ec2 describe-vpcs --filters Name=is-default,Values=true \\
  --query "Vpcs[].{VPC:VpcId,CIDR:CidrBlock}" --output table
aws ec2 describe-subnets --filters Name=default-for-az,Values=true \\
  --query "Subnets[].{AZ:AvailabilityZone,CIDR:CidrBlock,FreeIPs:AvailableIpAddressCount}" --output table
#   The default VPC is 172.31.0.0/16 with a /20 per AZ: FreeIPs shows 4091 on an empty subnet.

# 3) Your own private and public IP
hostname -I            # private address(es)
curl -s https://checkip.amazonaws.com    # the public address the internet sees (after NAT)</code></pre>` },

    { type: "casestudy", title: "Case study: an IP address plan for a multi-account, multi-Region company", html: `
<p><strong>Company:</strong> Helios Health, a telemedicine provider. Today: one data centre (<code>192.168.0.0/16</code> and an old lab on <code>172.16.0.0/16</code>). Plan: 3 AWS Regions (us-east-1, eu-west-1, ap-south-1), separate prod/staging/dev accounts per product, a shared-services account, and a Transit Gateway per Region connected to the data centre by Direct Connect.</p>
<p><strong>The trap they avoided.</strong> In the pilot, two teams had both created <code>10.0.0.0/16</code> VPCs. When the Transit Gateway went in, only one of them could be routed. They re-addressed the smaller pilot over a weekend and decided to plan centrally from then on.</p>
<p><strong>Plan.</strong> Reserve <code>10.0.0.0/8</code> for AWS, give each Region a <code>/12</code> (16 × /16), and each VPC a <code>/16</code>. The on-prem ranges are outside 10/8, so they never clash.</p>
<table>
<thead><tr><th>Block</th><th>Assigned to</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><code>10.0.0.0/12</code> (10.0–10.15)</td><td>us-east-1</td><td>10.0/16 shared services · 10.1/16 inspection VPC · 10.2/16 prod-portal · 10.3/16 staging-portal · 10.4/16 dev-portal · 10.5–10.15 free</td></tr>
<tr><td><code>10.16.0.0/12</code> (10.16–10.31)</td><td>eu-west-1</td><td>Same layout: 10.16/16 shared · 10.17/16 inspection · 10.18/16 prod-portal…</td></tr>
<tr><td><code>10.32.0.0/12</code> (10.32–10.47)</td><td>ap-south-1</td><td>Same layout</td></tr>
<tr><td><code>10.48.0.0/12</code> – <code>10.224.0.0/12</code></td><td>Future Regions</td><td>13 more Regions possible</td></tr>
<tr><td><code>10.240.0.0/12</code></td><td>Reserved</td><td>Client VPN pools, partner NAT ranges</td></tr>
<tr><td><code>192.168.0.0/16</code>, <code>172.16.0.0/16</code></td><td>On-premises</td><td>Never used in AWS</td></tr>
<tr><td><code>100.64.0.0/16</code></td><td>EKS pod secondary CIDR</td><td>Reused in every VPC; never routed outside its VPC (non-routable by design)</td></tr>
</tbody></table>
<p><strong>Inside each /16</strong> they use the layout in Figure M02-3: public /22s, app /20s and data /22s across three AZs, plus a /28 TGW attachment subnet per AZ.</p>
<p><strong>Implementation.</strong> They configured <strong>AWS IPAM</strong> with a top-level pool of 10.0.0.0/8, Regional pools of /12, and allocation rules that every VPC is /16. VPCs are created by infrastructure-as-code that asks IPAM for the next free /16, so overlap is impossible by construction.</p>
<p><strong>Result.</strong> Each Region's Transit Gateway route table needs one summarised route per remote Region (for example <code>10.16.0.0/12</code> → the eu-west-1 peering attachment) and one for on-prem (<code>192.168.0.0/16</code>). Firewall rules can say "all of eu-west-1" in one line.</p>
<p><strong>Lessons learned.</strong></p>
<ul>
  <li>Allocate on <strong>bit boundaries</strong> per Region and per environment so routes and rules summarise.</li>
  <li>Plan for <strong>10× growth</strong>: unused private space is free; re-addressing is not.</li>
  <li>Avoid ranges that collide with tooling defaults (<code>172.17.0.0/16</code> for Docker, the default VPC's <code>172.31.0.0/16</code>) and with partners' and acquired companies' networks.</li>
</ul>` },

    { type: "exam", html: `
<table>
<thead><tr><th>Stem says</th><th>Think</th></tr></thead>
<tbody>
<tr><td>"How many IP addresses are available for EC2 instances in subnet x/y?"</td><td>2<sup>(32−y)</sup> − 5</td></tr>
<tr><td>"Largest / smallest VPC"</td><td>/16 / /28</td></tr>
<tr><td>"VPC is running out of IP addresses"</td><td>Add a <strong>secondary CIDR</strong> and new subnets (you can't resize existing ones)</td></tr>
<tr><td>"Cannot create VPC peering connection"</td><td>Overlapping CIDRs (or transitive-peering misconception)</td></tr>
<tr><td>"Prevent overlapping CIDRs across accounts"</td><td>Amazon VPC IPAM</td></tr>
<tr><td>"IPv6 instances must reach the internet but must not be reachable from it"</td><td>Egress-only internet gateway (not a NAT gateway)</td></tr>
<tr><td>"Public IP changes after stop/start; need a fixed one"</td><td>Elastic IP</td></tr>
<tr><td>"Instance metadata"</td><td><code>169.254.169.254</code></td></tr>
</tbody></table>
<p><strong>Distractors:</strong> answering 254 (or 256) instead of 251 for a /24; "modify the subnet CIDR" (not possible); "NAT gateway for IPv6" (use egress-only IGW); assuming 172.16.0.0/12 ends at 172.16.255.255 (it ends at 172.31.255.255).</p>` },

    { type: "architect", html: `
<ul>
  <li><strong>IP exhaustion is an outage cause.</strong> EKS with the VPC CNI, Lambda in VPCs, interface endpoints and load balancers all consume subnet IPs. Monitor <code>AvailableIpAddressCount</code> (or IPAM utilisation) and alert at 70–80%.</li>
  <li><strong>Load balancers need headroom.</strong> ALBs scale by adding nodes in your subnets; AWS recommends at least a /27 per subnet for an ALB, with spare free IPs.</li>
  <li><strong>Don't over-tighten.</strong> Tiny /28 app subnets save nothing (private IPs are free) and block future growth.</li>
  <li><strong>Public IPv4 costs money.</strong> Every public IPv4 address (Elastic or auto-assigned) is billed hourly. Prefer private subnets + load balancers, VPC endpoints, and IPv6 where clients support it.</li>
  <li><strong>Mergers and partners.</strong> Expect overlap with acquired companies. PrivateLink (service-level connectivity) and private NAT gateways are the escape hatches; re-addressing is the long-term fix.</li>
  <li><strong>Write it down.</strong> Keep the IP plan in IPAM or IaC, not in someone's head or a stale wiki page.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>IPv4 = 32 bits in four octets; the prefix /n says how many leading bits are network bits.</li>
  <li>Addresses in a /n = 2<sup>(32−n)</sup>; usable in an AWS subnet = that − 5 (network, router, DNS, reserved, broadcast).</li>
  <li>Block size ("magic number") = 256 − mask octet; network = the largest multiple ≤ the address; broadcast = next network − 1.</li>
  <li>Private ranges: 10/8, 172.16/12 (to 172.31.255.255), 192.168/16; plus 100.64/10 shared, 169.254/16 link-local (IMDS 169.254.169.254).</li>
  <li>VPC and subnet blocks: /16 to /28. Subnets live in one AZ and can't be resized; grow a VPC with secondary CIDRs.</li>
  <li>Overlapping CIDRs prevent peering and break routing; plan centrally (AWS IPAM) on bit boundaries so routes summarise.</li>
  <li>IPv6 on AWS: /56 per VPC, /64 per subnet, globally unique, no NAT; egress-only IGW for outbound-only.</li>
</ul>` }
  ],
  drills: [
    { id: "M02.02-d1", q: "How many IP addresses are in a <code>/20</code> block?", answers: ["4096", "4,096"], hint: "2<sup>(32 − 20)</sup>.", explain: "2<sup>12</sup> = 4,096." },
    { id: "M02.02-d2", q: "How many IP addresses can you assign to instances in an AWS subnet <code>10.0.1.0/24</code>?", answers: ["251"], hint: "AWS reserves 5 addresses in every subnet.", explain: "256 − 5 = 251 (network, router, DNS, future use, broadcast)." },
    { id: "M02.02-d3", q: "How many assignable IPs does the smallest possible AWS subnet (<code>/28</code>) have?", answers: ["11"], explain: "2<sup>4</sup> = 16; 16 − 5 = 11." },
    { id: "M02.02-d4", q: "What is the network address of <code>10.0.37.200/20</code>? (Answer without the prefix.)", answers: ["10.0.32.0", "10.0.32.0/20"], hint: "/20 → 3rd octet, block size 16. Largest multiple of 16 that is ≤ 37?", explain: "Block size 256 − 240 = 16; 32 ≤ 37 &lt; 48, so the network is 10.0.32.0." },
    { id: "M02.02-d5", q: "What is the broadcast address of <code>172.16.5.130/26</code>?", answers: ["172.16.5.191"], hint: "/26 → 4th octet, block size 64.", explain: "130 is in the 128–191 block; the last address is 172.16.5.191." },
    { id: "M02.02-d6", q: "How many <code>/24</code> subnets fit in a <code>/20</code>?", answers: ["16"], explain: "2<sup>(24 − 20)</sup> = 16." },
    { id: "M02.02-d7", q: "Do <code>10.0.0.0/16</code> and <code>10.0.128.0/17</code> overlap? (yes/no)", answers: ["yes", "y"], explain: "10.0.128.0/17 covers 10.0.128.0–10.0.255.255, which is inside 10.0.0.0/16." },
    { id: "M02.02-d8", q: "Do <code>10.1.0.0/16</code> and <code>10.0.0.0/16</code> overlap? (yes/no)", answers: ["no", "n"], explain: "10.0.0.0/16 ends at 10.0.255.255; 10.1.0.0/16 starts at 10.1.0.0." },
    { id: "M02.02-d9", q: "Which prefix length corresponds to the subnet mask <code>255.255.240.0</code>?", answers: ["/20", "20"], hint: "240 = 11110000: count the 1-bits.", explain: "8 + 8 + 4 = 20 network bits." },
    { id: "M02.02-d10", q: "Write the subnet mask for a <code>/27</code> in dotted decimal.", answers: ["255.255.255.224"], explain: "27 = 24 + 3 bits; 3 leading 1-bits in the last octet = 128 + 64 + 32 = 224." },
    { id: "M02.02-d11", q: "In AWS subnet <code>10.0.1.0/24</code>, what is the first IP address you can assign to an instance?", answers: ["10.0.1.4"], explain: ".0 network, .1 VPC router, .2 DNS, .3 reserved, so .4 is first." },
    { id: "M02.02-d12", q: "In AWS subnet <code>10.0.16.0/20</code>, what is the address of the VPC router (default gateway)?", answers: ["10.0.16.1"], explain: "Always the network address + 1." },
    { id: "M02.02-d13", q: "What is the smallest prefix (largest number) that gives an AWS subnet at least 500 assignable IPs?", answers: ["/23", "23"], hint: "Try /24 (251) and then /23.", explain: "/23 = 512 − 5 = 507 ≥ 500; /24 = 251 is too small." },
    { id: "M02.02-d14", q: "Summarise <code>192.168.0.0/24</code>, <code>192.168.1.0/24</code>, <code>192.168.2.0/24</code> and <code>192.168.3.0/24</code> as one CIDR block.", answers: ["192.168.0.0/22"], explain: "Four /24s = 2 bits fewer: /22, starting at 192.168.0.0 (0 is a multiple of 4)." },
    { id: "M02.02-d15", q: "Is <code>172.32.0.5</code> an RFC 1918 private address? (yes/no)", answers: ["no", "n"], hint: "172.16.0.0/12 runs from 172.16.0.0 to …?", explain: "172.16.0.0/12 ends at 172.31.255.255, so 172.32.0.5 is a public address." },
    { id: "M02.02-d16", q: "What is the network address of <code>10.20.130.9/18</code>?", answers: ["10.20.128.0", "10.20.128.0/18"], hint: "/18 → 3rd octet, block size 64.", explain: "Blocks start at 0, 64, 128, 192; 130 is in 128–191, so 10.20.128.0 (broadcast 10.20.191.255)." },
    { id: "M02.02-d17", q: "How many /64 IPv6 subnets fit in the /56 that AWS assigns to a VPC?", answers: ["256"], explain: "2<sup>(64 − 56)</sup> = 2<sup>8</sup> = 256." }
  ],
  check: [
    { id: "M02.02-k1", type: "single", domain: "D3", task: "3.4", level: 100,
      stem: "A solutions architect creates a subnet with the CIDR block <code>10.0.4.0/24</code>. How many IP addresses are available for Amazon EC2 instances in this subnet?",
      options: [
        { t: "251", c: true, why: "A /24 has 256 addresses and AWS reserves 5 in every subnet." },
        { t: "254", c: false, why: "That is the traditional count (network and broadcast removed), but AWS reserves three more." },
        { t: "256", c: false, why: "That is the total, ignoring all reserved addresses." },
        { t: "250", c: false, why: "AWS reserves exactly 5 addresses, not 6." }
      ] },
    { id: "M02.02-k2", type: "single", domain: "D2", task: "2.2", level: 200,
      stem: "A company's VPC (<code>10.0.0.0/16</code>) must be connected to a partner's VPC using VPC peering. The peering request fails. The partner's VPC uses <code>10.0.0.0/16</code>. What is the cause?",
      options: [
        { t: "VPC peering is not supported between VPCs with overlapping CIDR blocks", c: true, why: "Routing can't distinguish identical addresses on both sides, so AWS rejects the peering." },
        { t: "VPC peering requires both VPCs to be in the same AWS account", c: false, why: "Cross-account (and cross-Region) peering is supported." },
        { t: "The VPCs must use IPv6 for peering", c: false, why: "IPv4 peering is fully supported." },
        { t: "A /16 VPC is too large to peer", c: false, why: "Size is not a restriction; overlap is." }
      ] },
    { id: "M02.02-k3", type: "single", domain: "D3", task: "3.4", level: 200,
      stem: "An application's private subnets are nearly out of IP addresses because of rapid growth in Amazon EKS pods. The VPC CIDR is <code>10.0.0.0/16</code> and is fully allocated to subnets. What should a solutions architect do?",
      options: [
        { t: "Associate a secondary CIDR block (for example from 100.64.0.0/10) with the VPC and create new subnets for pods", c: true, why: "Secondary CIDRs add address space without disrupting existing subnets; 100.64.0.0/10 is commonly used for pod IPs." },
        { t: "Modify the existing subnets to use a larger prefix", c: false, why: "Subnet CIDRs cannot be changed after creation." },
        { t: "Change the VPC's primary CIDR to 10.0.0.0/8", c: false, why: "The primary CIDR can't be changed, and /8 exceeds the /16 maximum per block." },
        { t: "Assign Elastic IP addresses to the pods", c: false, why: "Elastic IPs are public addresses; they don't add private subnet capacity." }
      ] },
    { id: "M02.02-k4", type: "single", domain: "D1", task: "1.2", level: 200,
      stem: "EC2 instances in a dual-stack private subnet must download updates over IPv6 from the internet. Connections initiated from the internet to the instances over IPv6 must be blocked. Which component should be added to the route table for <code>::/0</code>?",
      options: [
        { t: "An egress-only internet gateway", c: true, why: "It allows outbound-initiated IPv6 traffic and its responses, and blocks inbound-initiated connections." },
        { t: "A NAT gateway", c: false, why: "NAT gateways translate IPv4 (and NAT64); they're not the IPv6 outbound-only solution." },
        { t: "An internet gateway", c: false, why: "IPv6 addresses are public, so an IGW route allows inbound-initiated connections too (subject to SGs)." },
        { t: "A virtual private gateway", c: false, why: "That terminates VPN connections to on-premises networks, not internet access." }
      ] },
    { id: "M02.02-k5", type: "multi", domain: "D3", task: "3.4", level: 200,
      stem: "Which of the following IP addresses are reserved by AWS in the subnet <code>10.0.8.0/22</code>?",
      options: [
        { t: "10.0.8.1", c: true, why: "Network + 1 is the VPC router." },
        { t: "10.0.11.255", c: true, why: "The last address of 10.0.8.0–10.0.11.255 is the broadcast address." },
        { t: "10.0.8.4", c: false, why: "Network + 4 is the first assignable address." },
        { t: "10.0.9.0", c: false, why: "Inside a /22, 10.0.9.0 is an ordinary host address." },
        { t: "10.0.8.255", c: false, why: "That would be the broadcast of a /24, but this subnet is a /22 ending at 10.0.11.255." }
      ] },
    { id: "M02.02-k6", type: "single", domain: "D1", task: "1.2", level: 200,
      stem: "A company with 60 AWS accounts in AWS Organizations keeps creating VPCs with overlapping CIDR blocks, which blocks Transit Gateway routing. Which solution prevents this with the LEAST ongoing effort?",
      options: [
        { t: "Use Amazon VPC IP Address Manager (IPAM) pools with allocation rules, and create VPCs from IPAM", c: true, why: "IPAM centrally allocates non-overlapping CIDRs across the organization and monitors usage." },
        { t: "Maintain a shared spreadsheet of CIDR blocks", c: false, why: "Manual and error-prone: exactly how overlap happens." },
        { t: "Use the default VPC in every account", c: false, why: "Every default VPC is 172.31.0.0/16, guaranteeing overlap." },
        { t: "Use VPC peering instead of Transit Gateway", c: false, why: "Peering also fails with overlapping CIDRs." }
      ] }
  ],
  cards: ["fc-M02-2-01", "fc-M02-2-02", "fc-M02-2-03", "fc-M02-2-04", "fc-M02-2-05", "fc-M02-2-06", "fc-M02-2-07", "fc-M02-2-08", "fc-M02-2-09", "fc-M02-2-10", "fc-M02-2-11", "fc-M02-2-12"],
  references: [
    "Amazon VPC User Guide: \"IP addressing for your VPCs and subnets\", \"Subnet CIDR blocks\" (reserved addresses)",
    "Amazon VPC IPAM User Guide",
    "RFC 1918 (private address space), RFC 4632 (CIDR), RFC 6598 (shared address space), RFC 4291 (IPv6 addressing)",
    "<em>System Design on AWS</em> ch.6 \"Communication Networks &amp; Protocols\" (PDF p247–299)"
  ]
});

FLASHCARDS.push(
  { id: "fc-M02-2-01", front: "Number of addresses in a /n?", back: "2<sup>(32 − n)</sup>. /24 = 256, /20 = 4,096, /16 = 65,536, /28 = 16." },
  { id: "fc-M02-2-02", front: "Usable IPs in an AWS subnet?", back: "2<sup>(32 − n)</sup> − 5. /24 → 251, /28 → 11, /20 → 4,091." },
  { id: "fc-M02-2-03", front: "The 5 reserved addresses in an AWS subnet?", back: "Network (.0), VPC router (+1), Amazon DNS (+2), future use (+3), broadcast (last)." },
  { id: "fc-M02-2-04", front: "Allowed VPC / subnet block sizes?", back: "Between /16 (65,536) and /28 (16)." },
  { id: "fc-M02-2-05", front: "The three RFC 1918 private ranges?", back: "10.0.0.0/8 · 172.16.0.0/12 (to 172.31.255.255) · 192.168.0.0/16." },
  { id: "fc-M02-2-06", front: "Block size (magic number) shortcut?", back: "256 − mask value in the interesting octet. Networks start at multiples of it; broadcast = next network − 1." },
  { id: "fc-M02-2-07", front: "Mask octet values for 1–8 bits?", back: "128, 192, 224, 240, 248, 252, 254, 255." },
  { id: "fc-M02-2-08", front: "VPC running out of IPs: fix?", back: "Add a secondary CIDR block and create new subnets. Subnets and the primary CIDR can't be resized." },
  { id: "fc-M02-2-09", front: "Why can't two VPCs with 10.0.0.0/16 be peered?", back: "Overlapping CIDRs: routing can't tell which side an address belongs to. Prevent with a central plan / AWS IPAM." },
  { id: "fc-M02-2-10", front: "IPv6 sizes on AWS?", back: "VPC: /56 (Amazon-provided default). Subnet: /64. Addresses are globally unique; no NAT." },
  { id: "fc-M02-2-11", front: "IPv6 outbound-only internet access?", back: "Egress-only internet gateway (the IPv6 counterpart of a NAT gateway)." },
  { id: "fc-M02-2-12", front: "169.254.169.254 and 169.254.169.253?", back: "Instance metadata service (IMDS) and the Amazon-provided DNS resolver (link-local addresses)." }
);

  // ================================================================== 03_routing.js
/* ---------------------------------------------------------------- M02.03 Routing and NAT */
var DG_0203_VPC = `
<figure>
<svg class="diagram" viewBox="0 0 760 470" role="img" aria-labelledby="m0203at m0203ad">
  <title id="m0203at">VPC routing with public and private subnets in two Availability Zones</title>
  <desc id="m0203ad">A VPC 10.0.0.0/16 spans two AZs. Each AZ has a public subnet with a NAT gateway and a private subnet with application instances. An internet gateway is attached to the VPC. The public route table sends 0.0.0.0/0 to the internet gateway; each private route table sends 0.0.0.0/0 to the NAT gateway in its own AZ and S3 traffic to a gateway endpoint.</desc>
  <defs><marker id="m0203a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>

  <text class="dg-ts" x="300" y="14">Internet</text>
  <rect class="dg-edge" x="300" y="22" width="160" height="34" rx="8"/>
  <text class="dg-tb" x="314" y="44">Internet gateway</text>

  <rect class="dg-region" x="10" y="64" width="740" height="292" rx="14"/>
  <text class="dg-ta" x="22" y="84">VPC 10.0.0.0/16</text>

  <rect class="dg-az" x="22" y="92" width="352" height="254" rx="10"/>
  <text class="dg-tb" x="34" y="112">AZ a</text>
  <rect class="dg-good" x="34" y="120" width="328" height="96" rx="8"/>
  <text class="dg-t" x="44" y="138">Public subnet 10.0.1.0/24 (→ Public RT)</text>
  <rect class="dg-box" x="44" y="152" width="140" height="50" rx="6"/>
  <text class="dg-tb" x="54" y="172">NAT gateway A</text>
  <text class="dg-ts" x="54" y="190">EIP 3.120.10.10</text>
  <rect class="dg-box" x="200" y="152" width="152" height="50" rx="6"/>
  <text class="dg-tb" x="210" y="172">Web EC2</text>
  <text class="dg-ts" x="210" y="190">10.0.1.10 · 54.200.1.7</text>
  <rect class="dg-info" x="34" y="228" width="328" height="108" rx="8"/>
  <text class="dg-t" x="44" y="246">Private subnet 10.0.11.0/24 (→ Private RT-A)</text>
  <rect class="dg-box" x="44" y="264" width="160" height="50" rx="6"/>
  <text class="dg-tb" x="54" y="284">App EC2</text>
  <text class="dg-ts" x="54" y="302">10.0.11.25 (no public IP)</text>

  <rect class="dg-az" x="386" y="92" width="352" height="254" rx="10"/>
  <text class="dg-tb" x="398" y="112">AZ b</text>
  <rect class="dg-good" x="398" y="120" width="328" height="96" rx="8"/>
  <text class="dg-t" x="408" y="138">Public subnet 10.0.2.0/24 (→ Public RT)</text>
  <rect class="dg-box" x="408" y="152" width="140" height="50" rx="6"/>
  <text class="dg-tb" x="418" y="172">NAT gateway B</text>
  <text class="dg-ts" x="418" y="190">EIP 3.120.20.20</text>
  <rect class="dg-info" x="398" y="228" width="328" height="108" rx="8"/>
  <text class="dg-t" x="408" y="246">Private subnet 10.0.12.0/24 (→ Private RT-B)</text>
  <rect class="dg-box" x="408" y="264" width="160" height="50" rx="6"/>
  <text class="dg-tb" x="418" y="284">App EC2</text>
  <text class="dg-ts" x="418" y="302">10.0.12.40 (no public IP)</text>

  <path class="dg-line" d="M124 264 V206" marker-end="url(#m0203a-ar)"/>
  <path class="dg-line" d="M114 152 V100 H330 V60" marker-end="url(#m0203a-ar)"/>
  <path class="dg-line" d="M488 264 V206" marker-end="url(#m0203a-ar)"/>
  <path class="dg-line" d="M478 152 V100 H430 V60" marker-end="url(#m0203a-ar)"/>

  <rect class="dg-box" x="10" y="368" width="240" height="96" rx="8"/>
  <text class="dg-tb" x="20" y="388">Public RT</text>
  <text class="dg-ts" x="20" y="408">10.0.0.0/16 → local</text>
  <text class="dg-ts" x="20" y="424">0.0.0.0/0 → igw-0a1b</text>
  <text class="dg-ts" x="20" y="448">Makes a subnet "public"</text>

  <rect class="dg-box" x="260" y="368" width="240" height="96" rx="8"/>
  <text class="dg-tb" x="270" y="388">Private RT-A</text>
  <text class="dg-ts" x="270" y="408">10.0.0.0/16 → local</text>
  <text class="dg-ts" x="270" y="424">0.0.0.0/0 → nat-A (same AZ)</text>
  <text class="dg-ts" x="270" y="440">pl-s3 (S3 prefixes) → vpce-s3</text>

  <rect class="dg-box" x="510" y="368" width="240" height="96" rx="8"/>
  <text class="dg-tb" x="520" y="388">Private RT-B</text>
  <text class="dg-ts" x="520" y="408">10.0.0.0/16 → local</text>
  <text class="dg-ts" x="520" y="424">0.0.0.0/0 → nat-B (same AZ)</text>
  <text class="dg-ts" x="520" y="440">pl-s3 (S3 prefixes) → vpce-s3</text>
</svg>
<figcaption>Figure M02-4. The classic two-tier VPC. What makes a subnet public is its route table, not its name. Each private route table points at the NAT gateway in its own AZ.</figcaption>
</figure>`;

var DG_0203_PAT = `
<figure>
<svg class="diagram" viewBox="0 0 760 250" role="img" aria-labelledby="m0203bt m0203bd">
  <title id="m0203bt">Port address translation</title>
  <desc id="m0203bd">Two private hosts both use source port 51000. The NAT device rewrites both to its single public address with different ports, 40001 and 40002, and records the mapping in a translation table so return traffic is sent to the right host.</desc>
  <defs><marker id="m0203b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-info" x="10" y="20" width="200" height="56" rx="8"/>
  <text class="dg-tb" x="20" y="42">Host A</text><text class="dg-ts" x="20" y="62">192.168.1.10:51000</text>
  <rect class="dg-info" x="10" y="100" width="200" height="56" rx="8"/>
  <text class="dg-tb" x="20" y="122">Host B</text><text class="dg-ts" x="20" y="142">192.168.1.11:51000</text>
  <rect class="dg-edge" x="270" y="40" width="200" height="100" rx="10"/>
  <text class="dg-tb" x="282" y="64">NAT / PAT device</text>
  <text class="dg-ts" x="282" y="84">inside: 192.168.1.1</text>
  <text class="dg-ts" x="282" y="100">outside: 203.0.113.5</text>
  <text class="dg-ts" x="282" y="120">keeps a translation table</text>
  <rect class="dg-good" x="540" y="60" width="210" height="60" rx="8"/>
  <text class="dg-tb" x="552" y="84">Web server</text><text class="dg-ts" x="552" y="104">198.51.100.20:443</text>
  <path class="dg-line" d="M210 48 H268" marker-end="url(#m0203b-ar)"/>
  <path class="dg-line" d="M210 128 H268" marker-end="url(#m0203b-ar)"/>
  <path class="dg-line" d="M470 90 H538" marker-end="url(#m0203b-ar)"/>
  <rect class="dg-box" x="10" y="172" width="740" height="70" rx="8"/>
  <text class="dg-tb" x="20" y="192">Translation table</text>
  <text class="dg-ts" x="20" y="212">192.168.1.10:51000 ⇄ 203.0.113.5:40001 ⇄ 198.51.100.20:443 (TCP, ESTABLISHED)</text>
  <text class="dg-ts" x="20" y="230">192.168.1.11:51000 ⇄ 203.0.113.5:40002 ⇄ 198.51.100.20:443 (TCP, ESTABLISHED)</text>
</svg>
<figcaption>Figure M02-5. Port address translation (PAT, also called NAPT or "NAT overload"): many private hosts share one public IP, told apart by port.</figcaption>
</figure>`;

LESSONS.push({
  id: "M02.03", title: "Routing and NAT", level: 200, minutes: 50,
  objectives: [
    "Read a route table and pick the route for any destination using longest-prefix match",
    "Explain static vs dynamic routing and the role of BGP in AWS hybrid connectivity",
    "Compare static NAT, dynamic NAT and PAT, and explain why NAT blocks unsolicited inbound connections",
    "Trace a packet from a public subnet and from a private subnet to the internet and back",
    "Choose between an internet gateway, NAT gateway, NAT instance, egress-only internet gateway and gateway endpoint"
  ],
  sections: [
    { type: "why", html: `
<p>"The instances in the private subnet can't download updates." "Why is our NAT gateway bill bigger than our EC2 bill?" "We peered VPC A to B and B to C, so why can't A talk to C?" These are the networking questions that come up again and again in real AWS teams, and every one of them is answered by <strong>reading a route table correctly</strong>.</p>
<p>On the SAA-C03 exam, routing hides inside many scenarios: making a subnet public or private, giving private instances outbound-only internet access, designing NAT for high availability, cutting data-processing charges with VPC endpoints, and connecting on-premises networks. This lesson gives you the mental model you will reuse in M09 (VPC), M10–M11 (VPC connectivity and hybrid networking) and every architecture you design.</p>` },

    { type: "concept", html: DG_0203_VPC + `
<h3>What a router does</h3>
<p>A <strong>router</strong> is a Layer 3 (network layer) device that forwards packets between networks. For each packet it looks <em>only</em> at the <strong>destination IP address</strong>, consults its <strong>route table</strong> and sends the packet to the next hop. It doesn't care where the packet came from. That one fact explains most routing surprises: <em>return traffic is routed independently</em>, using the route table of wherever the reply starts.</p>
<p>Each router makes only a <strong>local, next-hop decision</strong>. No single device knows the full path. The packet reaches its destination because every router along the way makes a sensible next-hop choice.</p>

<h3>Route tables</h3>
<p>A route table is a list of rules. Each <strong>route</strong> has two parts:</p>
<ul>
  <li><strong>Destination:</strong> a CIDR block (a range of addresses), e.g. <code>10.0.0.0/16</code> or <code>0.0.0.0/0</code>.</li>
  <li><strong>Target (next hop):</strong> where to send matching packets: a gateway, an interface, a peering connection, or "local".</li>
</ul>
<table>
<thead><tr><th>Destination</th><th>Target</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>10.0.0.0/16</code></td><td><code>local</code></td><td>Anything inside the VPC is delivered directly within the VPC</td></tr>
<tr><td><code>192.168.0.0/16</code></td><td><code>vgw-…</code></td><td>The on-premises network, reached over VPN or Direct Connect</td></tr>
<tr><td><code>0.0.0.0/0</code></td><td><code>igw-…</code></td><td>The <strong>default route</strong>: everything not matched by a more specific route goes to the internet</td></tr>
</tbody></table>
<p><code>0.0.0.0/0</code> matches every IPv4 address (a prefix length of 0 means "no bits need to match"), and <code>::/0</code> is the IPv6 equivalent. Because they match everything, they are the <strong>route of last resort</strong>.</p>

<h3>Longest-prefix match</h3>
<p>When more than one route matches a destination, the router picks the <strong>most specific</strong> one: the route with the <strong>longest prefix</strong> (the biggest number after the slash). A <code>/24</code> beats a <code>/16</code>, which beats a <code>/0</code>. The order you typed the routes in doesn't matter.</p>
<div class="callout"><strong>Analogy.</strong> Think of postal sorting. A letter addressed to "12 High Street, Springfield, Ohio" first matches "USA" (a /0-style catch-all), then "Ohio" and then "Springfield". The sorter uses the most specific rule it has. A local post office doesn't send it to the national hub if it already knows the street.</div>

<h3>Static vs dynamic routing</h3>
<table>
<thead><tr><th></th><th>Static routing</th><th>Dynamic routing</th></tr></thead>
<tbody>
<tr><td>How routes get there</td><td>An administrator types them in</td><td>Routers exchange routes using a routing protocol (BGP, OSPF)</td></tr>
<tr><td>Reaction to failure</td><td>None. The route stays even if the next hop is dead.</td><td>Routes are withdrawn and traffic moves to a working path automatically</td></tr>
<tr><td>Best for</td><td>Small, stable networks; simple VPN setups</td><td>Many prefixes, redundant links, failover</td></tr>
<tr><td>AWS examples</td><td>Routes you add to a VPC route table; static Site-to-Site VPN</td><td>BGP over Direct Connect and dynamic Site-to-Site VPN; <em>route propagation</em> into VPC route tables</td></tr>
</tbody></table>

<h3>BGP in one page</h3>
<p>The <strong>Border Gateway Protocol (BGP)</strong> is the routing protocol of the internet. It exchanges routes between <strong>autonomous systems (AS)</strong>, which are networks under one administrative control, each identified by an <strong>AS number (ASN)</strong>.</p>
<ul>
  <li><strong>Public ASNs</strong> are assigned by regional internet registries. <strong>Private ASNs</strong> (64512–65534 in the 16-bit range, plus a 32-bit private range) are used for private peering, which is typical for your side of a VPN or Direct Connect.</li>
  <li>A BGP router <strong>advertises</strong> the prefixes it can reach. Each advertisement carries <strong>path attributes</strong>. The best known is <strong>AS_PATH</strong>, the list of ASes the route has crossed. Shorter AS_PATHs are generally preferred.</li>
  <li><strong>AS_PATH prepending</strong> means repeating your own ASN several times in an advertisement so a path looks "longer" and less attractive. It's a common way to make one link the backup.</li>
  <li><strong>Longest-prefix match still wins first.</strong> BGP attributes only decide between routes for the <em>same</em> prefix. Advertising a more specific prefix over one link is the strongest way to steer traffic to it.</li>
  <li>BGP runs over <strong>TCP port 179</strong>. On AWS you meet it in Direct Connect (always BGP), Site-to-Site VPN (static or BGP) and Transit Gateway Connect.</li>
</ul>

<h3>Inside a subnet: ARP and the default gateway</h3>
<p>Routing gets a packet to the right <em>network</em>. The last hop to a host on the same network uses Layer 2. When a host wants to send to an IP <strong>in its own subnet</strong>, it uses <strong>ARP</strong> (Address Resolution Protocol) to ask "who has 10.0.11.40?" and learns that host's MAC address. For any IP <strong>outside its subnet</strong>, it sends the frame to its <strong>default gateway</strong>, the router for the subnet.</p>
<p>How does a host decide which case applies? It ANDs the destination with its own subnet mask. If the result equals its own network address, the destination is local; otherwise it goes to the gateway. You'll practise this math in M02.02.</p>

<h3>Public vs private IP addresses</h3>
<ul>
  <li><strong>Public IPs</strong> are globally unique and routable on the internet.</li>
  <li><strong>Private IPs</strong> (RFC 1918: <code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>, <code>192.168.0.0/16</code>) can be reused by every organisation and are <strong>never routed on the public internet</strong>. Internet routers drop them.</li>
  <li>So a host with only a private IP needs a translator to talk to the internet. That translator is <strong>NAT</strong>.</li>
</ul>

<h3>Network Address Translation (NAT)</h3>
<p><strong>NAT</strong> rewrites the IP addresses (and often ports) in packet headers as they cross a boundary device.</p>
<table>
<thead><tr><th>Type</th><th>Mapping</th><th>Inbound connections from outside?</th><th>Typical use</th></tr></thead>
<tbody>
<tr><td><strong>Static NAT (1:1)</strong></td><td>One private IP ⇄ one fixed public IP</td><td>Yes, the host is reachable on its public IP (subject to firewalls)</td><td>A server that must be reachable. On AWS this is what an <strong>internet gateway</strong> does for an instance with a public or Elastic IP.</td></tr>
<tr><td><strong>Dynamic NAT</strong></td><td>Private IPs ⇄ a pool of public IPs, allocated on demand</td><td>Only for active mappings</td><td>Rare today</td></tr>
<tr><td><strong>PAT / NAPT ("NAT overload")</strong></td><td>Many private IP:port ⇄ one public IP, distinguished by port</td><td><strong>No.</strong> Only replies to connections started from inside.</td><td>Home routers, corporate egress, the AWS <strong>NAT gateway</strong></td></tr>
</tbody></table>
` + DG_0203_PAT + `
<h3>Why NAT is stateful, and why it blocks inbound traffic</h3>
<p>A PAT device must remember every outbound flow (inside IP:port ⇄ outside port ⇄ remote IP:port) in a <strong>translation table</strong>, so it can rewrite the reply back to the right host. That memory is <strong>state</strong>. When a packet arrives from the internet that matches <em>no</em> entry, the device has no idea which inside host it is for, so it drops it.</p>
<p>That is why "private instances that can reach out but cannot be reached" is the classic NAT requirement. Note that NAT is <em>not</em> a security control by design. It's a side effect. You still need security groups and NACLs.</p>` },

    { type: "workflow", title: "Packet walks: how traffic really flows", html: `
<h3>(a) An EC2 instance in a public subnet calls an internet API</h3>
<p>Instance <code>10.0.1.10</code> has public IP <code>54.200.1.7</code>. Inside the OS, <code>ip addr</code> shows only <code>10.0.1.10</code>. The public IP is never configured on the instance.</p>
<ol class="flow">
  <li>The application opens a TCP connection to <code>198.51.100.20:443</code>. The kernel builds a packet: <strong>src</strong> <code>10.0.1.10:50312</code>, <strong>dst</strong> <code>198.51.100.20:443</code>.</li>
  <li>The destination isn't in <code>10.0.1.0/24</code>, so the instance sends it to its default gateway, the VPC router at <code>10.0.1.1</code>.</li>
  <li>The security group's outbound rules and the subnet's NACL outbound rules are evaluated. Both allow it.</li>
  <li>The VPC router looks up the subnet's route table. <code>198.51.100.20</code> doesn't match <code>10.0.0.0/16 → local</code>, so it matches <code>0.0.0.0/0 → igw</code>.</li>
  <li>The <strong>internet gateway performs 1:1 NAT</strong>: the source becomes <code>54.200.1.7:50312</code>. The packet goes out to the internet.</li>
  <li>The reply arrives at the IGW addressed to <code>54.200.1.7</code>. The IGW rewrites the destination back to <code>10.0.1.10</code>. The NACL inbound rules (stateless, so they must allow the ephemeral port) and the security group (stateful, so it automatically allows the reply) are checked, and the packet is delivered.</li>
</ol>
<div class="callout warn"><strong>Both conditions are needed.</strong> An instance is internet-reachable only if (1) its subnet's route table has a route to an IGW <em>and</em> (2) it has a public IPv4 or Elastic IP (or an IPv6 address). A public IP in a subnet with no IGW route is useless. An IGW route with no public IP gives no internet access either.</div>

<h3>(b) A private-subnet instance downloads a patch through a NAT gateway</h3>
<ol class="flow">
  <li>Instance <code>10.0.11.25</code> (no public IP) sends <strong>src</strong> <code>10.0.11.25:41000</code> → <strong>dst</strong> <code>198.51.100.20:443</code>.</li>
  <li>Private RT-A: <code>0.0.0.0/0 → nat-A</code>. The packet goes to NAT gateway A, which sits in the <strong>public</strong> subnet of the same AZ.</li>
  <li>The NAT gateway performs <strong>PAT</strong>: it records the flow and rewrites the source to its own address and a new port.</li>
  <li>The NAT gateway's own subnet (public) uses the Public RT: <code>0.0.0.0/0 → igw</code>. The packet leaves through the IGW, and the internet sees the NAT gateway's <strong>Elastic IP</strong> <code>3.120.10.10</code> as the source.</li>
  <li>The reply comes back to <code>3.120.10.10</code> → IGW → NAT gateway. The NAT gateway finds the entry in its translation table and rewrites the destination to <code>10.0.11.25:41000</code>.</li>
  <li>The packet is delivered to the private instance. A connection <em>started</em> from the internet towards <code>3.120.10.10</code> matches no entry and is dropped.</li>
</ol>
<div class="callout tip"><strong>Remember the chain:</strong> private subnet → (private RT) → NAT gateway in the public subnet → (public RT) → IGW → internet. Two route tables are involved. A NAT gateway placed in a <em>private</em> subnet can't work, because its subnet has no route to an IGW.</div>

<h3>(c) An on-premises user reaches an app server over Site-to-Site VPN</h3>
<ol class="flow">
  <li>A user at <code>192.168.20.15</code> connects to <code>10.0.11.25</code>. The corporate router sends <code>10.0.0.0/16</code> to the <strong>customer gateway device</strong> (the on-premises VPN router).</li>
  <li>The customer gateway encrypts the packet inside an <strong>IPsec</strong> tunnel to AWS's <strong>virtual private gateway (VGW)</strong>, or to a Transit Gateway. AWS provides two tunnels, terminating in different AZs, for redundancy.</li>
  <li>The VGW decrypts the packet and delivers it into the VPC (<code>local</code> route) to <code>10.0.11.25</code>. The security group must allow <code>192.168.0.0/16</code>.</li>
  <li><strong>The reply needs its own route.</strong> Private RT-A must contain <code>192.168.0.0/16 → vgw</code>, either as a static route or learned via <strong>route propagation</strong> (BGP). Without it, the reply follows <code>0.0.0.0/0 → nat-A</code> and is lost. This is the #1 "VPN is up but nothing works" cause.</li>
</ol>` },

    { type: "aws", html: `
<h3>Route tables in a VPC</h3>
<ul>
  <li>Every VPC has a built-in router (you never see it as a resource). You control it through <strong>route tables</strong>.</li>
  <li>Each subnet is associated with <strong>exactly one</strong> route table. A route table can serve many subnets. Subnets you don't explicitly associate use the VPC's <strong>main route table</strong>. Best practice: leave the main table private (no IGW route) and explicitly associate public subnets with a public table, so a new subnet is never public by accident.</li>
  <li>Every route table has a <strong>local route</strong> for the VPC CIDR(s). It can't be deleted, so all subnets in a VPC can always route to each other. Isolation <em>within</em> a VPC is done with security groups and NACLs, not routing. (You <em>can</em> add a more specific route inside the VPC range to send traffic through an inspection appliance; that's an advanced pattern covered in M09.)</li>
  <li><strong>A "public subnet" is simply a subnet whose route table has a route to an internet gateway.</strong> There is no "public" checkbox.</li>
</ul>

<h3>Route priority in a VPC route table</h3>
<ol>
  <li><strong>Longest-prefix match first</strong>, always.</li>
  <li>For identical prefixes, <strong>static routes beat propagated routes</strong>.</li>
  <li>Among propagated routes to a virtual private gateway with the same prefix: Direct Connect BGP routes, then static VPN routes, then BGP VPN routes (shortest AS_PATH preferred).</li>
</ol>

<h3>Gateways and targets: the comparison you must know</h3>
<div class="table-wrap"><table>
<thead><tr><th></th><th>Internet gateway (IGW)</th><th>NAT gateway</th><th>NAT instance</th><th>Egress-only IGW</th></tr></thead>
<tbody>
<tr><td>Direction</td><td>Inbound and outbound</td><td>Outbound only (IPv4)</td><td>Outbound only (can also do port forwarding)</td><td>Outbound only (<strong>IPv6</strong>)</td></tr>
<tr><td>Translation</td><td>1:1 NAT for public/Elastic IPv4</td><td>PAT to its Elastic IP</td><td>PAT (iptables masquerade)</td><td>None. IPv6 addresses are global; it just blocks inbound-initiated flows.</td></tr>
<tr><td>Scope / HA</td><td>One per VPC, horizontally scaled, redundant</td><td><strong>AZ-scoped</strong>, redundant inside its AZ. Deploy <strong>one per AZ</strong>.</td><td>A single EC2 instance. You build HA (scripts, ASG).</td><td>One per VPC, highly available</td></tr>
<tr><td>Bandwidth</td><td>No practical limit</td><td>Scales automatically up to 100 Gbps</td><td>Depends on instance type</td><td>No practical limit</td></tr>
<tr><td>Security groups</td><td>N/A</td><td>Can't attach a SG (use NACLs or SGs on the instances)</td><td>Yes, it's an EC2 instance</td><td>N/A</td></tr>
<tr><td>Special settings</td><td>Attach to VPC + route</td><td>Lives in a public subnet, needs an EIP</td><td><strong>Disable source/destination check</strong>; lives in a public subnet</td><td>Route <code>::/0 → eigw</code></td></tr>
<tr><td>Cost</td><td>No charge for the gateway (data transfer is charged)</td><td><strong>Per hour + per GB processed</strong></td><td>EC2 instance cost; you manage patching</td><td>No hourly charge (data transfer charged)</td></tr>
<tr><td>Exam signal</td><td>"Public subnet", "reachable from the internet"</td><td>"Private instances need outbound internet, least operational overhead / highly available"</td><td>"Cheapest for a tiny dev workload", "need a bastion on the same box" (legacy)</td><td>"IPv6 instances must not accept inbound connections"</td></tr>
</tbody></table></div>
<p><strong>Source/destination check:</strong> by default an EC2 instance drops traffic that isn't addressed to or from itself. A NAT instance (or any firewall/router appliance) forwards other hosts' traffic, so the check must be disabled.</p>

<h3>Gateway VPC endpoints: routing that saves money</h3>
<ul>
  <li><strong>S3 and DynamoDB</strong> support <strong>gateway endpoints</strong>. You add the endpoint to route tables, and AWS inserts a route whose destination is a <strong>prefix list</strong> (e.g. <code>pl-6ca54005</code>, the S3 IP ranges for that Region) and whose target is the endpoint (<code>vpce-…</code>).</li>
  <li>Because the prefix list is more specific than <code>0.0.0.0/0</code>, longest-prefix match sends S3 traffic to the endpoint, <strong>bypassing the NAT gateway</strong>.</li>
  <li>Gateway endpoints have <strong>no hourly or data-processing charge</strong>. They work only for same-Region S3/DynamoDB and only from inside the VPC (not from on-premises or peered VPCs). <strong>Interface endpoints</strong> (PrivateLink) cover most other services, at an hourly + per-GB price. That's covered in M09.</li>
</ul>

<h3>Connecting VPCs: peering vs Transit Gateway</h3>
<table>
<thead><tr><th></th><th>VPC peering</th><th>Transit Gateway (TGW)</th></tr></thead>
<tbody>
<tr><td>Topology</td><td>Point-to-point between two VPCs (same or different account/Region)</td><td>Hub and spoke: VPCs, VPNs and Direct Connect gateways attach to one regional hub</td></tr>
<tr><td>Transitive routing</td><td><strong>No.</strong> A–B and B–C does not give A–C. No "edge-to-edge" use of the peer's IGW, NAT, VPN or DX either.</td><td><strong>Yes</strong>, controlled by TGW route tables</td></tr>
<tr><td>Overlapping CIDRs</td><td>Not allowed</td><td>Not routable (plan non-overlapping ranges)</td></tr>
<tr><td>Cost</td><td>No hourly charge, data transfer only</td><td>Per attachment-hour + per GB processed</td></tr>
<tr><td>Scale</td><td>Full mesh grows as n(n−1)/2 connections</td><td>Thousands of attachments</td></tr>
</tbody></table>
<p>In both cases <strong>you must add routes</strong> on both sides (e.g. <code>10.1.0.0/16 → pcx-…</code>). Creating the connection alone moves no traffic.</p>` },

    { type: "examples", title: "Worked examples", html: `
<h3>Example 1: longest-prefix match</h3>
<p>A subnet's route table:</p>
<pre><code>Destination        Target
10.0.0.0/16        local
10.1.0.0/16        pcx-11aa        (peering to VPC B)
10.1.5.0/24        tgw-22bb        (Transit Gateway)
192.168.0.0/16     vgw-33cc        (VPN to on-premises)
pl-6ca54005        vpce-44dd       (S3 gateway endpoint)
0.0.0.0/0          nat-55ee</code></pre>
<table>
<thead><tr><th>Destination IP</th><th>Matching routes</th><th>Winner</th><th>Why</th></tr></thead>
<tbody>
<tr><td><code>10.0.7.9</code></td><td>10.0.0.0/16, 0.0.0.0/0</td><td><code>local</code></td><td>/16 beats /0</td></tr>
<tr><td><code>10.1.5.20</code></td><td>10.1.0.0/16, 10.1.5.0/24, 0.0.0.0/0</td><td><code>tgw-22bb</code></td><td>/24 is the longest</td></tr>
<tr><td><code>10.1.9.9</code></td><td>10.1.0.0/16, 0.0.0.0/0</td><td><code>pcx-11aa</code></td><td>10.1.9.x isn't in 10.1.5.0/24</td></tr>
<tr><td><code>52.218.x.x</code> (an S3 address)</td><td>pl-…, 0.0.0.0/0</td><td><code>vpce-44dd</code></td><td>Prefix-list entries are more specific than /0</td></tr>
<tr><td><code>8.8.8.8</code></td><td>0.0.0.0/0 only</td><td><code>nat-55ee</code></td><td>Default route</td></tr>
</tbody></table>
<p>How to check membership quickly: for <code>10.1.5.0/24</code>, the first 24 bits (the first three octets) must equal <code>10.1.5</code>. For <code>10.1.0.0/16</code>, the first two octets must equal <code>10.1</code>. Non-octet boundaries (/20, /27) are practised in M02.02.</p>

<h3>Example 2: a PAT translation table</h3>
<p>Router outside address <code>203.0.113.5</code>. Two laptops browse the same site:</p>
<pre><code>Inside (private)        Outside (translated)   Remote
192.168.1.10:51000  ->  203.0.113.5:40001  ->  198.51.100.20:443
192.168.1.11:51000  ->  203.0.113.5:40002  ->  198.51.100.20:443

Reply arrives:  dst 203.0.113.5:40002  -> table lookup -> 192.168.1.11:51000
Unsolicited:    dst 203.0.113.5:22     -> no entry      -> dropped</code></pre>
<p>A NAT gateway can support about 55,000 simultaneous connections <em>to each unique destination</em> (IP, port and protocol) per assigned IP address. Workloads that open huge numbers of connections to one endpoint can exhaust ports (watch the <code>ErrorPortAllocation</code> CloudWatch metric). The fix is to add secondary IPs to the NAT gateway or spread traffic.</p>

<h3>Example 3: building the two-tier VPC routing with the CLI</h3>
<pre><code># Assumes VPC vpc-0abc, subnets created, profile academy-admin
IGW=$(aws ec2 create-internet-gateway --query InternetGateway.InternetGatewayId --output text)
aws ec2 attach-internet-gateway --internet-gateway-id $IGW --vpc-id vpc-0abc

# Public route table: default route to the IGW
PUB_RT=$(aws ec2 create-route-table --vpc-id vpc-0abc --query RouteTable.RouteTableId --output text)
aws ec2 create-route --route-table-id $PUB_RT --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW
aws ec2 associate-route-table --route-table-id $PUB_RT --subnet-id subnet-pub-a

# NAT gateway in the PUBLIC subnet of AZ a, with an Elastic IP
EIP=$(aws ec2 allocate-address --domain vpc --query AllocationId --output text)
NAT=$(aws ec2 create-nat-gateway --subnet-id subnet-pub-a --allocation-id $EIP \\
      --query NatGateway.NatGatewayId --output text)
aws ec2 wait nat-gateway-available --nat-gateway-ids $NAT

# Private route table for AZ a: default route to the NAT gateway in the same AZ
PRIV_RT_A=$(aws ec2 create-route-table --vpc-id vpc-0abc --query RouteTable.RouteTableId --output text)
aws ec2 create-route --route-table-id $PRIV_RT_A --destination-cidr-block 0.0.0.0/0 --nat-gateway-id $NAT
aws ec2 associate-route-table --route-table-id $PRIV_RT_A --subnet-id subnet-priv-a

# S3 gateway endpoint on the private route table (free; bypasses NAT for S3)
aws ec2 create-vpc-endpoint --vpc-id vpc-0abc --vpc-endpoint-type Gateway \\
  --service-name com.amazonaws.eu-west-1.s3 --route-table-ids $PRIV_RT_A</code></pre>
<p>Inspect the result:</p>
<pre><code>aws ec2 describe-route-tables --route-table-ids $PRIV_RT_A \\
  --query "RouteTables[].Routes[].[DestinationCidrBlock,DestinationPrefixListId,GatewayId,NatGatewayId,State]" --output table
# ----------------------------------------------------------------
# |  10.0.0.0/16 |  None         |  local        |  None        | active |
# |  0.0.0.0/0   |  None         |  None         |  nat-0f1e... | active |
# |  None        |  pl-6ca54005  |  vpce-0d2c... |  None        | active |
# ----------------------------------------------------------------</code></pre>
<p>A route in state <code>blackhole</code> means its target no longer exists (e.g. a deleted NAT gateway). Traffic matching it is dropped silently.</p>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>What you'd choose</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Web servers must accept HTTPS from the internet</td><td>Put the <em>load balancer</em> in public subnets (route to IGW); keep the instances in private subnets</td><td>Only the ALB needs public reachability; instances stay unreachable directly</td></tr>
<tr><td>Private app servers need OS patches and third-party APIs</td><td>One NAT gateway per AZ, with per-AZ private route tables</td><td>Outbound only, managed, highly available; no cross-AZ dependency</td></tr>
<tr><td>Batch jobs read terabytes from S3 in private subnets</td><td>S3 gateway endpoint on the private route tables</td><td>Removes NAT per-GB processing charges; traffic stays on the AWS network</td></tr>
<tr><td>IPv6-only containers must call out but never be reachable</td><td>Egress-only internet gateway with <code>::/0 → eigw</code></td><td>IPv6 has no NAT; the EIGW provides the outbound-only behaviour</td></tr>
<tr><td>A third party must allow-list one fixed source IP for your calls</td><td>NAT gateway with an Elastic IP (one per AZ, so give them all EIPs)</td><td>All outbound traffic appears to come from known EIPs</td></tr>
<tr><td>Fifteen VPCs plus two VPNs need any-to-any connectivity</td><td>Transit Gateway</td><td>Peering is non-transitive and a 15-VPC mesh needs 105 peerings</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: read your own routing (local machine and CloudShell)", html: `
<p>These commands are free and read-only. In WSL or Linux:</p>
<pre><code># Your machine's route table: look for the default route and your gateway
ip route
# default via 172.24.80.1 dev eth0          &lt;- default route (0.0.0.0/0) to the gateway
# 172.24.80.0/20 dev eth0 proto kernel ...   &lt;- your local subnet (delivered directly, via ARP)

# Which route would be used for a destination? (the kernel does longest-prefix match for you)
ip route get 8.8.8.8
ip route get 172.24.80.5

# The ARP / neighbour cache: IP-to-MAC mappings learned on your subnet
ip neigh

# Your public IP as the internet sees it (after your router's NAT)
curl -s https://checkip.amazonaws.com
hostname -I     # compare: your private IP(s)</code></pre>
<p>Notice that the address <code>checkip</code> returns is <em>not</em> on any of your interfaces. That's PAT at your home or office router, exactly what a NAT gateway does in AWS.</p>
<p>In <strong>AWS CloudShell</strong> (if you have a default VPC):</p>
<pre><code># Default VPC subnets are public: find the IGW route in the main route table
aws ec2 describe-route-tables --filters Name=association.main,Values=true \\
  --query "RouteTables[].Routes[].[DestinationCidrBlock,GatewayId]" --output table</code></pre>` },

    { type: "casestudy", title: "Case study: the NAT gateway bill that beat the compute bill", html: `
<p><strong>Company:</strong> Lumen Analytics, a 40-person SaaS start-up running nightly data pipelines on ECS in <code>eu-west-1</code>.</p>
<p><strong>Situation:</strong> The monthly AWS bill jumped from about $9,000 to $14,500. Cost Explorer showed the biggest growth under <em>EC2-Other</em>, specifically <strong>NAT gateway data processing</strong> and <strong>inter-AZ data transfer</strong>, larger than the containers themselves.</p>
<p><strong>Investigation:</strong></p>
<ul>
  <li>The pipeline tasks ran in private subnets in three AZs and read about 60 TB/month from S3. With no VPC endpoint, all S3 traffic matched <code>0.0.0.0/0 → nat</code> and was charged NAT processing per GB.</li>
  <li>To "save money", the team had created <strong>only one NAT gateway</strong>, in AZ a. All three private route tables pointed to it. Traffic from AZ b and AZ c therefore also crossed AZs, adding inter-AZ transfer charges in both directions, and created a single point of failure. When AZ a had problems earlier that year, tasks in AZ b and c lost internet access too.</li>
  <li>VPC Flow Logs, grouped by destination prefix, showed over 85% of NAT bytes going to S3 IP ranges.</li>
</ul>
<p><strong>Decision:</strong></p>
<table>
<thead><tr><th>Change</th><th>Effect</th></tr></thead>
<tbody>
<tr><td>Add an S3 gateway endpoint to all private route tables</td><td>S3 traffic now matches the more specific prefix-list route; no NAT processing and no charge for the endpoint</td></tr>
<tr><td>Add a DynamoDB gateway endpoint (they also used DynamoDB)</td><td>Same benefit for DynamoDB</td></tr>
<tr><td>Deploy one NAT gateway per AZ; each private route table uses its own AZ's NAT</td><td>No cross-AZ hairpin, and an AZ failure stays contained</td></tr>
<tr><td>Interface endpoints for ECR, CloudWatch Logs and STS (evaluated case by case)</td><td>Cheaper than NAT at their volume, and keeps image pulls private</td></tr>
</tbody></table>
<p><strong>Result:</strong> NAT-related charges fell by roughly 80% in the next bill, even though two extra NAT gateways added a small fixed hourly cost. Resilience improved at the same time.</p>
<p><strong>Lessons learned:</strong> (1) the cheapest-looking design (one NAT gateway) was both more expensive and less resilient; (2) <em>always</em> add S3 and DynamoDB gateway endpoints to private route tables, since they're free; (3) use Flow Logs and Cost Explorer's usage types to find which destinations drive NAT bytes; (4) treat routing as a cost lever, not only a connectivity setting.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>Keyword in the question</th><th>Likely answer</th></tr></thead>
<tbody>
<tr><td>"Instances in a private subnet need to download updates", "must not be reachable from the internet"</td><td>NAT gateway in a <strong>public</strong> subnet + <code>0.0.0.0/0 → nat</code> in the private route table</td></tr>
<tr><td>"Highly available" outbound internet</td><td>One NAT gateway <strong>per AZ</strong>, each private subnet routed to its own AZ's NAT</td></tr>
<tr><td>"Reduce NAT gateway costs for S3/DynamoDB traffic"</td><td><strong>Gateway VPC endpoint</strong> (free)</td></tr>
<tr><td>"IPv6", "outbound only"</td><td><strong>Egress-only internet gateway</strong></td></tr>
<tr><td>"Instance can't reach the internet despite being in a public subnet"</td><td>Missing public IP/EIP, or missing IGW route, or SG/NACL rules</td></tr>
<tr><td>"VPC A ↔ B and B ↔ C are peered; A can't reach C"</td><td>Peering is <strong>not transitive</strong>: add A–C peering or use Transit Gateway</td></tr>
<tr><td>"Many VPCs and on-prem networks, simplify connectivity"</td><td><strong>Transit Gateway</strong></td></tr>
<tr><td>"Make one Direct Connect/VPN path the backup"</td><td>BGP: advertise more specific prefixes on the primary, or AS_PATH prepending on the backup</td></tr>
</tbody></table>
<p><strong>Common distractors:</strong></p>
<ul>
  <li>Putting the NAT gateway in the private subnet (it must be in a public subnet).</li>
  <li>Routing a private subnet's <code>0.0.0.0/0</code> to the IGW (that makes it public, and its instances still have no public IP).</li>
  <li>"Attach a security group to the NAT gateway" (not possible).</li>
  <li>"NAT instance" when the question says "least operational overhead" or "highly available".</li>
  <li>An interface endpoint for S3 when the question asks for the <em>most cost-effective</em> option for in-VPC access (the gateway endpoint is free). The interface endpoint is right when on-premises clients or peered VPCs need private S3 access.</li>
</ul>` },

    { type: "architect", html: `
<ul>
  <li><strong>Troubleshooting playbook ("can't connect"):</strong> work outwards in this order. (1) Source and destination IPs right? DNS resolving to what you expect? (2) <strong>Route table of the source subnet</strong> (forward path). (3) <strong>Route table of the destination subnet</strong> (return path). (4) Security groups (stateful). (5) NACLs on both subnets (stateless: allow ephemeral ports 1024–65535 for replies). (6) OS firewall and the application listening. <strong>VPC Reachability Analyzer</strong> automates steps 2–5. <strong>VPC Flow Logs</strong> show ACCEPT/REJECT records.</li>
  <li><strong>Plan CIDRs once, for the whole organisation.</strong> Overlapping ranges block peering and TGW routing forever. Use IPAM (Amazon VPC IP Address Manager) to allocate non-overlapping blocks per account and Region.</li>
  <li><strong>NAT gateway costs scale with bytes.</strong> Gateway endpoints for S3/DynamoDB, interface endpoints for high-volume AWS APIs, and keeping traffic in the same AZ are the main levers. A centralised "egress VPC" behind a Transit Gateway can cut the number of NAT gateways for many small VPCs, but adds TGW processing charges, so do the math.</li>
  <li><strong>Public IPv4 addresses cost money</strong> (an hourly charge for every public IPv4 address, in use or idle, since 2024). Prefer private subnets behind load balancers, remove unneeded public IPs, and consider IPv6 for egress with an egress-only IGW.</li>
  <li><strong>Hybrid failover:</strong> static VPN routes don't fail over. Use BGP (dynamic) VPN or Direct Connect with BGP, and test the failover by actually disabling the primary.</li>
  <li><strong>Blackhole routes</strong> appear when a target (NAT gateway, instance, peering) is deleted. Alert on them in IaC drift checks.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>Routers forward by <strong>destination IP</strong>, using <strong>longest-prefix match</strong>. Return traffic is routed separately, by the other side's route table.</li>
  <li><code>0.0.0.0/0</code> and <code>::/0</code> are default routes: the route of last resort.</li>
  <li>Static routes don't react to failures. Dynamic routing (BGP on AWS) does. BGP prefers longer prefixes first, then attributes like a shorter AS_PATH.</li>
  <li>Private (RFC 1918) addresses need NAT to reach the internet. PAT shares one public IP using ports and is stateful, which is why it blocks unsolicited inbound traffic.</li>
  <li>A <strong>public subnet</strong> = route table with a route to an <strong>IGW</strong>. A reachable instance also needs a public IP or EIP.</li>
  <li><strong>NAT gateway:</strong> in a public subnet, AZ-scoped, one per AZ for HA, billed per hour + per GB, no security groups.</li>
  <li><strong>Egress-only IGW</strong> = outbound-only for IPv6. <strong>Gateway endpoints</strong> for S3/DynamoDB are free route-table targets that bypass NAT.</li>
  <li>VPC peering is <strong>non-transitive</strong> and needs routes on both sides. Transit Gateway is the transitive hub.</li>
</ul>` }
  ],
  drills: [
    { id: "M02.03-d1", q: "Using the route table in <em>Worked example 1</em>, which target is used for destination <code>10.1.5.200</code>?", answers: ["tgw-22bb", "tgw"], hint: "Which routes contain 10.1.5.200? Pick the one with the longest prefix.", explain: "Both 10.1.0.0/16 and 10.1.5.0/24 match; /24 is longer, so the Transit Gateway wins.", placeholder: "e.g. pcx-11aa" },
    { id: "M02.03-d2", q: "Same table: which target is used for <code>10.1.6.1</code>?", answers: ["pcx-11aa", "pcx"], hint: "Is 10.1.6.1 inside 10.1.5.0/24?", explain: "10.1.6.x is outside 10.1.5.0/24, so the next most specific match is 10.1.0.0/16 → the peering connection." },
    { id: "M02.03-d3", q: "Same table: which target is used for <code>192.168.44.7</code>?", answers: ["vgw-33cc", "vgw"], explain: "192.168.0.0/16 covers 192.168.0.0–192.168.255.255; /16 beats the /0 default route." },
    { id: "M02.03-d4", q: "Same table: which target is used for <code>10.0.255.254</code>?", answers: ["local"], explain: "10.0.0.0/16 spans 10.0.0.0–10.0.255.255, so the address is inside the VPC → local." },
    { id: "M02.03-d5", q: "A route table contains <code>10.0.0.0/8 → vgw-1</code>, <code>10.20.0.0/16 → pcx-1</code> and <code>0.0.0.0/0 → igw-1</code>. Which target does <code>10.21.0.5</code> use?", answers: ["vgw-1", "vgw"], hint: "Is the second octet 20?", explain: "10.21.x.x is not in 10.20.0.0/16, but it is in 10.0.0.0/8 (any address starting with 10) → vgw-1." },
    { id: "M02.03-d6", q: "Using the PAT table in <em>Worked example 2</em>: a reply arrives addressed to <code>203.0.113.5:40001</code>. Which inside <em>IP address</em> receives it?", answers: ["192.168.1.10", "192.168.1.10:51000"], explain: "Outside port 40001 maps to 192.168.1.10:51000 in the translation table." },
    { id: "M02.03-d7", q: "A VPC has private subnets in 3 AZs. How many NAT gateways does the highly available, no-cross-AZ design need?", answers: ["3", "three"], explain: "One NAT gateway per AZ, each private route table pointing at the NAT in its own AZ." }
  ],
  check: [
    { id: "M02.03-k1", type: "single", domain: "D1", task: "1.2", level: 200,
      stem: "Application servers in private subnets must download software updates from the internet. They must not be reachable from the internet. The solution must have the LEAST operational overhead. What should a solutions architect do?",
      options: [
        { t: "Create a NAT gateway in a public subnet and add a <code>0.0.0.0/0</code> route to it in the private subnets' route table", c: true, why: "A managed NAT gateway provides outbound-only IPv4 access with no servers to patch or scale." },
        { t: "Launch a NAT instance in a public subnet and disable source/destination checks", c: false, why: "This works, but you must patch, scale and make it highly available yourself: more operational overhead." },
        { t: "Add a <code>0.0.0.0/0</code> route to the internet gateway in the private subnets' route table", c: false, why: "That makes the subnets public, and the instances have no public IPs anyway, so they still couldn't connect." },
        { t: "Attach an egress-only internet gateway to the VPC", c: false, why: "Egress-only internet gateways work only for IPv6 traffic." }
      ] },
    { id: "M02.03-k2", type: "single", domain: "D2", task: "2.2", level: 200,
      stem: "A VPC has private subnets in two Availability Zones. Both private route tables send <code>0.0.0.0/0</code> to a single NAT gateway in AZ A. Which change makes outbound internet access resilient to the failure of one AZ?",
      options: [
        { t: "Create a NAT gateway in a public subnet in AZ B and point AZ B's private route table at it", c: true, why: "NAT gateways are AZ-scoped. One per AZ, with per-AZ routing, removes the cross-AZ dependency (and the cross-AZ data charges)." },
        { t: "Add a second Elastic IP to the existing NAT gateway", c: false, why: "More IPs add port capacity, not AZ resilience. The gateway is still in one AZ." },
        { t: "Replace the NAT gateway with a larger NAT instance", c: false, why: "A single instance is still a single point of failure in one AZ." },
        { t: "Enable route propagation on both private route tables", c: false, why: "Route propagation imports VPN/DX routes. It has nothing to do with NAT redundancy." }
      ] },
    { id: "M02.03-k3", type: "single", domain: "D4", task: "4.4", level: 200,
      stem: "EC2 instances in private subnets read about 40 TB per month from Amazon S3 buckets in the same Region through a NAT gateway. What is the MOST cost-effective way to reduce data-processing charges?",
      options: [
        { t: "Create an S3 gateway VPC endpoint and associate it with the private route tables", c: true, why: "Gateway endpoints are free, and the prefix-list route is more specific than 0.0.0.0/0, so S3 traffic bypasses the NAT gateway." },
        { t: "Create an S3 interface VPC endpoint in each private subnet", c: false, why: "Interface endpoints also bypass NAT, but they carry hourly and per-GB charges. The gateway endpoint is cheaper for in-VPC access." },
        { t: "Enable S3 Transfer Acceleration on the buckets", c: false, why: "Transfer Acceleration speeds up long-distance uploads over the internet and adds cost." },
        { t: "Replace the NAT gateway with an internet gateway route in the private subnets", c: false, why: "That makes the subnets public, and the instances lack public IPs. It's also a security regression." }
      ] },
    { id: "M02.03-k4", type: "multi", domain: "D1", task: "1.2", level: 200,
      stem: "A VPC has an internet gateway attached. An EC2 instance in a newly created subnet can't be reached from the internet on port 443, although its security group allows HTTPS from 0.0.0.0/0. Which TWO conditions must ALSO be true for the instance to be reachable?",
      options: [
        { t: "The subnet's route table has a <code>0.0.0.0/0</code> route to the internet gateway", c: true, why: "This is what makes the subnet public. New subnets use the main route table, which often has no IGW route." },
        { t: "The instance has a public IPv4 address or an Elastic IP", c: true, why: "The IGW performs 1:1 NAT only for instances with a public or Elastic IP." },
        { t: "A NAT gateway exists in the subnet", c: false, why: "NAT gateways provide outbound-only access. They never allow inbound connections." },
        { t: "Source/destination check is disabled on the instance", c: false, why: "That's needed only for instances that forward other hosts' traffic (NAT, firewall appliances)." },
        { t: "An egress-only internet gateway is attached", c: false, why: "That's IPv6 and outbound-only. It blocks inbound-initiated traffic." }
      ] },
    { id: "M02.03-k5", type: "single", domain: "D2", task: "2.1", level: 200,
      stem: "VPC A is peered with VPC B, and VPC B is peered with VPC C. All route tables have routes for their direct peers. Instances in VPC A cannot reach instances in VPC C. What is the reason?",
      options: [
        { t: "VPC peering is not transitive; A needs its own peering with C (or all three can attach to a Transit Gateway)", c: true, why: "Traffic can't transit through an intermediate peered VPC. Transit Gateway provides transitive routing." },
        { t: "Security groups can't reference peered VPCs", c: false, why: "Within a Region, security groups can reference security groups in a peered VPC. And that isn't the cause here." },
        { t: "Peering requires an internet gateway in VPC B", c: false, why: "Peering traffic never uses an IGW, and edge-to-edge routing through a peer's gateway isn't supported anyway." },
        { t: "VPC C must enable route propagation", c: false, why: "Route propagation is for VGW-learned (VPN/DX) routes, not peering." }
      ] },
    { id: "M02.03-k6", type: "single", domain: "D3", task: "3.4", level: 200,
      stem: "A company has a Site-to-Site VPN and a Direct Connect connection to the same VPC, both advertising <code>172.16.0.0/16</code> from on-premises. They want Direct Connect to carry traffic normally and the VPN only as backup. Without other changes, which path does AWS prefer for traffic to 172.16.0.0/16?",
      options: [
        { t: "Direct Connect, because for identical propagated prefixes AWS prefers Direct Connect BGP routes over VPN routes", c: true, why: "AWS's route priority for the same prefix: Direct Connect BGP, then static VPN, then BGP VPN." },
        { t: "The VPN, because it was created first", c: false, why: "Creation order has no effect on route selection." },
        { t: "Traffic is load-balanced 50/50 across both", c: false, why: "AWS selects a single best path based on route priority. It doesn't load balance between DX and VPN." },
        { t: "Neither: identical prefixes cause a routing conflict and both are rejected", c: false, why: "Identical prefixes are resolved by route priority rules, not rejected." }
      ] }
  ],
  cards: ["fc-M02-3-01", "fc-M02-3-02", "fc-M02-3-03", "fc-M02-3-04", "fc-M02-3-05", "fc-M02-3-06", "fc-M02-3-07", "fc-M02-3-08", "fc-M02-3-09", "fc-M02-3-10", "fc-M02-3-11"],
  references: [
    "<em>System Design on AWS</em> ch.5 \"Networking Components\" (PDF p215) and ch.6 \"Communication Networks &amp; Protocols\" (PDF p247–299)",
    "Amazon VPC User Guide: <em>Route tables</em>, <em>Route priority</em>, <em>NAT gateways</em>, <em>Gateway endpoints</em>",
    "Amazon VPC User Guide: <em>Compare NAT gateways and NAT instances</em>",
    "AWS Site-to-Site VPN User Guide: <em>Route priority</em>",
    "RFC 1918 (private address space), RFC 4271 (BGP-4)"
  ]
});

FLASHCARDS.push(
  { id: "fc-M02-3-01", front: "How does a router choose between several matching routes?", back: "<strong>Longest-prefix match:</strong> the most specific route (largest /n) wins. Order of entry doesn't matter." },
  { id: "fc-M02-3-02", front: "What makes a subnet \"public\" in AWS?", back: "Its route table has a route (usually 0.0.0.0/0) to an <strong>internet gateway</strong>. Instances also need a public IP or EIP to be reachable." },
  { id: "fc-M02-3-03", front: "Where must a NAT gateway be placed, and how many do you need for HA?", back: "In a <strong>public</strong> subnet, with an Elastic IP. <strong>One per AZ</strong>, with each private route table pointing to its own AZ's NAT gateway." },
  { id: "fc-M02-3-04", front: "NAT gateway vs NAT instance: three differences?", back: "NAT GW: managed, HA within its AZ, scales to 100 Gbps, no SGs. NAT instance: you manage HA and patching, SGs apply, <strong>must disable source/dest check</strong>." },
  { id: "fc-M02-3-05", front: "What gives IPv6 instances outbound-only internet access?", back: "An <strong>egress-only internet gateway</strong> with route <code>::/0 → eigw</code>." },
  { id: "fc-M02-3-06", front: "How do you stop S3/DynamoDB traffic from paying NAT processing charges?", back: "Add a <strong>gateway VPC endpoint</strong> (free) to the private route tables. Its prefix-list route is more specific than 0.0.0.0/0." },
  { id: "fc-M02-3-07", front: "Why does PAT block unsolicited inbound connections?", back: "It's stateful: replies are matched to entries in its translation table. An inbound packet with no entry has no inside destination, so it's dropped." },
  { id: "fc-M02-3-08", front: "Is VPC peering transitive?", back: "<strong>No.</strong> A–B + B–C ≠ A–C. No edge-to-edge routing through a peer's IGW/NAT/VPN either. Use Transit Gateway for transitive routing." },
  { id: "fc-M02-3-09", front: "VPC route priority for identical prefixes?", back: "Static routes beat propagated routes. Among propagated: Direct Connect BGP → static VPN → BGP VPN." },
  { id: "fc-M02-3-10", front: "What is AS_PATH prepending used for?", back: "Making a BGP path look longer (less preferred), e.g. to make a backup link secondary. A more specific prefix still wins over AS_PATH." },
  { id: "fc-M02-3-11", front: "\"VPN tunnel is UP but on-prem can't reach the instance.\" First thing to check?", back: "The <strong>return route</strong>: the instance subnet's route table needs the on-prem CIDR → VGW/TGW (static or propagated). Then SGs and NACLs." }
);

  // ================================================================== 04_dns.js
/* ---------------------------------------------------------------- M02.04 DNS */
var DG_0204_RESOLVE = `
<figure>
<svg class="diagram" viewBox="0 0 760 330" role="img" aria-labelledby="m0204at m0204ad">
  <title id="m0204at">DNS resolution of www.example.com</title>
  <desc id="m0204ad">A laptop's stub resolver sends a recursive query to a recursive resolver. The resolver queries iteratively: a root server refers it to the .com TLD servers, the TLD servers refer it to the example.com authoritative servers, and the authoritative server returns the answer, which the resolver caches and returns to the laptop.</desc>
  <defs><marker id="m0204a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>

  <rect class="dg-info" x="10" y="124" width="160" height="80" rx="10"/>
  <text class="dg-tb" x="22" y="148">Your laptop</text>
  <text class="dg-ts" x="22" y="168">stub resolver</text>
  <text class="dg-ts" x="22" y="186">browser + OS cache</text>

  <rect class="dg-edge" x="250" y="124" width="190" height="80" rx="10"/>
  <text class="dg-tb" x="262" y="148">Recursive resolver</text>
  <text class="dg-ts" x="262" y="168">ISP, 1.1.1.1, 8.8.8.8, or</text>
  <text class="dg-ts" x="262" y="186">Route 53 Resolver (VPC +2)</text>

  <rect class="dg-box" x="250" y="240" width="190" height="74" rx="10"/>
  <text class="dg-tb" x="262" y="262">Resolver cache</text>
  <text class="dg-ts" x="262" y="282">keeps each answer for its TTL</text>
  <text class="dg-ts" x="262" y="300">(and NXDOMAIN for SOA min.)</text>
  <path class="dg-link" d="M345 204 V240"/>

  <rect class="dg-good" x="560" y="10" width="190" height="64" rx="10"/>
  <text class="dg-tb" x="572" y="34">Root servers  (.)</text>
  <text class="dg-ts" x="572" y="54">a–m.root-servers.net</text>
  <rect class="dg-good" x="560" y="132" width="190" height="64" rx="10"/>
  <text class="dg-tb" x="572" y="156">TLD servers  (.com)</text>
  <text class="dg-ts" x="572" y="176">a–m.gtld-servers.net</text>
  <rect class="dg-good" x="560" y="254" width="190" height="64" rx="10"/>
  <text class="dg-tb" x="572" y="278">Authoritative</text>
  <text class="dg-ts" x="572" y="298">example.com (e.g. Route 53)</text>

  <path class="dg-line" d="M170 148 H248" marker-end="url(#m0204a-ar)"/>
  <text class="dg-ta" x="180" y="140">1 query</text>
  <path class="dg-line" d="M248 182 H172" marker-end="url(#m0204a-ar)"/>
  <text class="dg-ta" x="180" y="200">8 answer</text>

  <path class="dg-line" d="M440 132 L558 38" marker-end="url(#m0204a-ar)"/>
  <path class="dg-line" d="M558 58 L446 146" marker-end="url(#m0204a-ar)"/>
  <text class="dg-ta" x="470" y="74">2</text><text class="dg-ta" x="520" y="104">3</text>

  <path class="dg-line" d="M440 156 H558" marker-end="url(#m0204a-ar)"/>
  <path class="dg-line" d="M558 174 H442" marker-end="url(#m0204a-ar)"/>
  <text class="dg-ta" x="496" y="150">4</text><text class="dg-ta" x="496" y="190">5</text>

  <path class="dg-line" d="M440 192 L558 268" marker-end="url(#m0204a-ar)"/>
  <path class="dg-line" d="M558 292 L436 204" marker-end="url(#m0204a-ar)"/>
  <text class="dg-ta" x="474" y="236">6</text><text class="dg-ta" x="510" y="276">7</text>
</svg>
<figcaption>Figure M02-6. Step 1 is a <em>recursive</em> query ("get me the final answer"). Steps 2–7 are <em>iterative</em> queries: each server answers with what it knows, either a referral or the final record.</figcaption>
</figure>`;

var DG_0204_TREE = `
<figure>
<svg class="diagram" viewBox="0 0 760 262" role="img" aria-labelledby="m0204bt m0204bd">
  <title id="m0204bt">The DNS namespace tree</title>
  <desc id="m0204bd">The root sits at the top. Below it are top-level domains such as com, org and uk. Under com is the second-level domain example, and under that the hosts www and api, forming the fully qualified domain name www.example.com with a trailing dot.</desc>
  <path class="dg-link" d="M300 44 L110 88 M300 44 L300 88 M300 44 L490 88 M300 118 L300 152 M300 182 L200 216 M300 182 L400 216"/>
  <rect class="dg-good" x="250" y="14" width="100" height="30" rx="8"/><text class="dg-tb" x="276" y="34">root "."</text>
  <rect class="dg-box" x="60" y="88" width="100" height="30" rx="8"/><text class="dg-t" x="98" y="108">org</text>
  <rect class="dg-edge" x="250" y="88" width="100" height="30" rx="8"/><text class="dg-t" x="286" y="108">com</text>
  <rect class="dg-box" x="440" y="88" width="100" height="30" rx="8"/><text class="dg-t" x="482" y="108">uk</text>
  <rect class="dg-edge" x="250" y="152" width="100" height="30" rx="8"/><text class="dg-t" x="274" y="172">example</text>
  <rect class="dg-info" x="150" y="216" width="100" height="30" rx="8"/><text class="dg-t" x="186" y="236">www</text>
  <rect class="dg-info" x="350" y="216" width="100" height="30" rx="8"/><text class="dg-t" x="388" y="236">api</text>
  <text class="dg-ts" x="560" y="34">Level 0: the root zone</text>
  <text class="dg-ts" x="560" y="108">Level 1: top-level domains (TLDs)</text>
  <text class="dg-ts" x="560" y="164">Level 2: second-level domain</text>
  <text class="dg-ts" x="560" y="178">(you register example.com)</text>
  <text class="dg-ts" x="560" y="228">Level 3+: subdomains / hosts</text>
  <text class="dg-ta" x="560" y="246">FQDN: www.example.com.</text>
</svg>
<figcaption>Figure M02-7. DNS is a tree, read right to left from the root: "." → com → example → www. Responsibility for each branch is <em>delegated</em> with NS records. Each label is at most 63 characters.</figcaption>
</figure>`;

LESSONS.push({
  id: "M02.04", title: "DNS", level: 200, minutes: 55,
  objectives: [
    "Describe the DNS hierarchy and walk through a full resolution, including caching",
    "Choose the right record type (A, AAAA, CNAME, alias, MX, TXT, NS, SOA, PTR, SRV, CAA) for a requirement",
    "Plan TTLs for a zero-downtime migration and explain the CNAME-at-apex problem",
    "Map DNS concepts to Route 53: public/private hosted zones, alias records, routing policies, health checks and Resolver endpoints",
    "Troubleshoot DNS with <code>dig</code>"
  ],
  sections: [
    { type: "why", html: `
<p>"It's always DNS" is an old operations joke because it's so often true. A wrong record sends customers to an old server. A forgotten MX record stops a company's email. A high TTL makes a five-minute migration take a day. A missing forwarding rule means EC2 instances can't resolve on-premises names, and the hybrid project stalls.</p>
<p>On AWS, DNS is <strong>Amazon Route 53</strong>, and it appears all over the SAA-C03 exam: pointing a domain apex at a load balancer, active-passive failover between Regions, latency-based routing for global users, private DNS inside VPCs, and hybrid name resolution. This lesson builds the protocol knowledge you need before the Route 53 deep dive in M12.</p>` },

    { type: "concept", html: DG_0204_TREE + `
<h3>What DNS does</h3>
<p>The <strong>Domain Name System (DNS)</strong> is a distributed, hierarchical, cached database that maps <strong>names</strong> to <strong>data</strong>: most often a name to an IP address, but also mail servers, verification tokens and service locations. It lets humans use <code>shop.example.com</code> while machines use <code>203.0.113.25</code>, and it lets you change the IP without changing the name.</p>

<h3>The namespace</h3>
<ul>
  <li><strong>Root ("."):</strong> the top of the tree. It is served by 13 named root server identities (<code>a.root-servers.net</code> to <code>m.root-servers.net</code>), each run as hundreds of anycast instances around the world.</li>
  <li><strong>Top-level domains (TLDs):</strong> generic (<code>.com</code>, <code>.org</code>, <code>.dev</code>) and country-code (<code>.uk</code>, <code>.in</code>, <code>.de</code>), run by registries.</li>
  <li><strong>Second-level domain (SLD):</strong> the name you register, e.g. <code>example</code> in <code>example.com</code>.</li>
  <li><strong>Subdomains:</strong> anything to the left, e.g. <code>api.eu.example.com</code>. You create these freely in your own zone.</li>
  <li><strong>FQDN (fully qualified domain name):</strong> the complete name, which technically ends with a dot for the root: <code>www.example.com.</code>. In zone files a name <em>without</em> the trailing dot is relative to the zone, a classic source of mistakes like <code>www.example.com.example.com</code>.</li>
</ul>

<h3>Domains, zones and delegation</h3>
<p>A <strong>domain</strong> is a branch of the namespace. A <strong>zone</strong> is the part of that branch managed by one set of authoritative servers, stored as a set of records (a "zone file", or a <strong>hosted zone</strong> in Route 53). A parent zone <strong>delegates</strong> a child by publishing <strong>NS records</strong> that name the child's name servers. The <code>.com</code> zone delegates <code>example.com</code>, and <code>example.com</code> could delegate <code>dev.example.com</code> to a different team's hosted zone.</p>

<h3>Registrar vs DNS host</h3>
<table>
<thead><tr><th>Role</th><th>What it does</th><th>Example</th></tr></thead>
<tbody>
<tr><td><strong>Registrar</strong></td><td>Sells and renews the domain; tells the TLD registry which name servers are authoritative for it</td><td>Route 53 Domains, GoDaddy, Namecheap</td></tr>
<tr><td><strong>DNS hosting (authoritative)</strong></td><td>Serves the records for the zone</td><td>Route 53 hosted zone, Cloudflare DNS</td></tr>
</tbody></table>
<p>They don't have to be the same company. To use Route 53 for a domain registered elsewhere, create a hosted zone and set the domain's name servers <em>at the registrar</em> to the four Route 53 name servers listed in the zone's NS record.</p>

<h3>Two kinds of DNS server</h3>
<table>
<thead><tr><th></th><th>Recursive resolver</th><th>Authoritative name server</th></tr></thead>
<tbody>
<tr><td>Job</td><td>Finds answers on behalf of clients, following referrals, and <strong>caches</strong> them</td><td>Holds the actual records for a zone and answers definitively</td></tr>
<tr><td>Who uses it</td><td>Your laptop, your EC2 instances</td><td>Resolvers (never end users directly)</td></tr>
<tr><td>Examples</td><td>ISP resolver, 8.8.8.8, 1.1.1.1, <strong>Route 53 Resolver</strong> (the VPC "+2" address)</td><td><strong>Route 53 hosted zones</strong>, BIND, Active Directory DNS</td></tr>
</tbody></table>
<p>The small DNS client inside your OS is a <strong>stub resolver</strong>. It only knows how to ask its configured recursive resolver (from <code>/etc/resolv.conf</code>, or DHCP).</p>

<h3>Transport: UDP and TCP port 53</h3>
<p>Most queries use <strong>UDP port 53</strong> (fast, one packet each way). DNS uses <strong>TCP port 53</strong> for zone transfers and when a response is too big for UDP (the server sets the "truncated" flag and the client retries over TCP). EDNS(0) allows larger UDP responses, which matters with DNSSEC. <strong>Firewalls, security groups and NACLs must allow both UDP and TCP 53</strong> for DNS servers and Resolver endpoints.</p>

<h3>Record types you must know</h3>
<div class="table-wrap"><table>
<thead><tr><th>Type</th><th>Maps a name to…</th><th>Example</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><strong>A</strong></td><td>IPv4 address(es)</td><td><code>www 300 A 203.0.113.25</code></td><td>Several A records = several IPs, and clients pick one (basic DNS round robin)</td></tr>
<tr><td><strong>AAAA</strong></td><td>IPv6 address(es)</td><td><code>www 300 AAAA 2001:db8::25</code></td><td>"Quad-A"</td></tr>
<tr><td><strong>CNAME</strong></td><td>Another name (an alias in the generic sense)</td><td><code>blog 300 CNAME myblog.hosting.example.net.</code></td><td>The resolver then looks up the target. A CNAME <strong>can't coexist</strong> with any other record at the same name, so it's not allowed at the zone apex.</td></tr>
<tr><td><strong>MX</strong></td><td>Mail servers, with a <strong>priority</strong></td><td><code>@ 3600 MX 10 mx1.example.com.</code><br><code>@ 3600 MX 20 mx2.example.com.</code></td><td><strong>Lower number = preferred.</strong> Senders try 10 first, then 20. The target must be a name, not an IP or a CNAME.</td></tr>
<tr><td><strong>TXT</strong></td><td>Free-form text</td><td><code>@ TXT "v=spf1 include:amazonses.com -all"</code></td><td>Email authentication (SPF, DKIM, DMARC) and domain-ownership verification (ACM, Google, Microsoft 365)</td></tr>
<tr><td><strong>NS</strong></td><td>The authoritative name servers for a zone</td><td><code>@ 172800 NS ns-123.awsdns-15.com.</code></td><td>Used for delegation. Route 53 gives each hosted zone four NS servers across different TLDs.</td></tr>
<tr><td><strong>SOA</strong></td><td>Zone metadata (one per zone)</td><td>primary NS, admin email, <strong>serial</strong>, refresh, retry, expire, <strong>minimum</strong></td><td>The serial increments on change (for secondary servers). The last field is the <strong>negative-caching TTL</strong>: how long resolvers cache "this name does not exist" (NXDOMAIN).</td></tr>
<tr><td><strong>PTR</strong></td><td>An IP back to a name (reverse DNS)</td><td><code>25.113.0.203.in-addr.arpa. PTR www.example.com.</code></td><td>Lives in the <code>in-addr.arpa</code> (IPv4) or <code>ip6.arpa</code> zone. Mail servers check it. For Elastic IPs you request reverse DNS from AWS.</td></tr>
<tr><td><strong>SRV</strong></td><td>Service location: priority, weight, port, target</td><td><code>_sip._tcp 300 SRV 10 60 5060 sip1.example.com.</code></td><td>Used by SIP, LDAP/AD, XMPP, some service discovery</td></tr>
<tr><td><strong>CAA</strong></td><td>Which certificate authorities may issue certificates</td><td><code>@ CAA 0 issue "amazon.com"</code></td><td>If CAA records exist and don't list Amazon, <strong>ACM can't issue</strong> your certificate</td></tr>
</tbody></table></div>

<h3>Email authentication in one minute (all TXT records)</h3>
<ul>
  <li><strong>SPF</strong> lists which servers may send mail for your domain (<code>v=spf1 … -all</code>).</li>
  <li><strong>DKIM</strong> publishes a public key (at <code>selector._domainkey.example.com</code>) used to verify signed mail. Amazon SES gives you CNAMEs that point to its DKIM keys.</li>
  <li><strong>DMARC</strong> (at <code>_dmarc.example.com</code>) tells receivers what to do when SPF/DKIM fail, and where to send reports.</li>
</ul>

<h3>TTL: the time-to-live</h3>
<p>Every record has a <strong>TTL in seconds</strong>: how long resolvers may cache the answer. A high TTL (e.g. 86,400 = 1 day) means fewer queries, lower cost and faster lookups, but <strong>changes take up to a TTL to be seen everywhere</strong>. A low TTL (e.g. 60) means changes propagate quickly, at the price of more queries.</p>
<div class="callout tip"><strong>Migration rule:</strong> lower the TTL <em>at least one old-TTL period before</em> you change the record. If the TTL was 86,400 s, lower it to 60 s, wait 24 hours (so every cached copy with the old TTL has expired), then switch. Afterwards, raise the TTL again.</div>
<p>"DNS propagation" isn't really propagation. Authoritative servers update in seconds. What you wait for is <strong>caches expiring</strong>. Some clients (old JVMs, some browsers) cache longer than the TTL, so keep the old endpoint alive for a while after the cut-over.</p>

<h3>The CNAME-at-apex problem</h3>
<p>The <strong>zone apex</strong> (also called the root or "naked" domain) is <code>example.com</code> itself. The apex <em>must</em> have SOA and NS records. The DNS standard says a CNAME can't coexist with any other record at the same name, so <strong>you can't put a CNAME at the apex</strong>. That's a problem when the target only has a name, not a fixed IP, which is true of AWS load balancers and CloudFront distributions, whose IPs change.</p>
<p>Solutions: Route 53 <strong>alias records</strong> (see below), "CNAME flattening" or "ANAME" at other DNS providers, or redirect the apex to <code>www</code>.</p>

<h3>Split-horizon (split-view) DNS</h3>
<p>The same name returns <strong>different answers depending on who asks</strong>. For example, <code>api.example.com</code> resolves to a private IP for clients inside the VPC or corporate network, and to a public load balancer for internet users. On AWS you do this with a <strong>public hosted zone and a private hosted zone with the same name</strong>. VPCs associated with the private zone get the private answers.</p>

<h3>DNSSEC</h3>
<p>Plain DNS has no authentication, so a resolver can be tricked into caching forged answers (<strong>cache poisoning / spoofing</strong>). <strong>DNSSEC</strong> adds digital signatures to records, with a chain of trust from the root through the TLD (via DS records) to your zone. Resolvers that <em>validate</em> DNSSEC reject tampered answers. DNSSEC provides integrity and authenticity, <strong>not confidentiality</strong>. Encrypting queries is done separately by DNS over HTTPS/TLS.</p>` },

    { type: "workflow", title: "Resolving www.example.com, step by step", html: DG_0204_RESOLVE + `
<ol class="flow">
  <li><strong>Local caches first.</strong> The browser checks its own cache, then the OS stub resolver checks the OS cache and the <code>hosts</code> file. On a cache hit, resolution ends here in microseconds.</li>
  <li><strong>Recursive query (1).</strong> The stub sends "A record for www.example.com, please, and do the work for me" (the RD, recursion desired, flag) to its configured resolver.</li>
  <li><strong>Resolver cache.</strong> If the resolver has the answer cached and the TTL hasn't expired, it replies immediately. It may also have cached partial results, such as the <code>.com</code> name servers, and skip steps.</li>
  <li><strong>Root (2–3).</strong> The resolver asks a root server. The root doesn't know <code>www.example.com</code>, but replies with a <strong>referral</strong>: "ask the .com servers: <code>a.gtld-servers.net</code> …", plus their IPs (glue records).</li>
  <li><strong>TLD (4–5).</strong> The resolver asks a .com server, which replies with another referral: the NS records for <code>example.com</code>, e.g. the four Route 53 name servers <code>ns-123.awsdns-15.com</code> etc.</li>
  <li><strong>Authoritative (6–7).</strong> The resolver asks one of those name servers, which returns the answer with the AA (authoritative answer) flag: <code>www.example.com. 300 A 203.0.113.25</code>.</li>
  <li><strong>Cache and answer (8).</strong> The resolver caches the answer (and the referrals) for their TTLs and returns it to the stub. The browser opens a TCP connection to 203.0.113.25.</li>
</ol>
<p><strong>Recursive vs iterative queries:</strong> the client→resolver query is <em>recursive</em> (the resolver must return the final answer or an error). Resolver→root/TLD/authoritative queries are <em>iterative</em> (each server returns the best information it has, often a referral).</p>
<p><strong>If a name doesn't exist</strong>, the authoritative server returns <strong>NXDOMAIN</strong> plus its SOA record. The resolver caches that negative answer for the SOA's minimum/negative TTL. So if you create a record right after someone queried it, they may keep getting NXDOMAIN for that period.</p>

<h3>Resolution inside an AWS VPC</h3>
<ol class="flow">
  <li>An EC2 instance's stub resolver points at the <strong>Route 53 Resolver</strong>: the VPC's base CIDR <strong>+2</strong> address (e.g. <code>10.0.0.2</code>), also reachable at <code>169.254.169.253</code>. DHCP option sets provide this by default.</li>
  <li>The Resolver answers, in order: names in <strong>private hosted zones</strong> associated with the VPC, VPC-internal names (e.g. <code>ip-10-0-1-10.eu-west-1.compute.internal</code>), and names matching <strong>Resolver forwarding rules</strong> (sent via an outbound endpoint to, say, on-premises DNS). Everything else goes to public DNS recursively.</li>
  <li>On-premises servers can query AWS private zones by forwarding to a Resolver <strong>inbound endpoint</strong> (ENIs with IPs in your VPC).</li>
</ol>` },

    { type: "aws", title: "DNS on AWS: Route 53 and the Route 53 Resolver", html: `
<h3>Hosted zones</h3>
<table>
<thead><tr><th></th><th>Public hosted zone</th><th>Private hosted zone</th></tr></thead>
<tbody>
<tr><td>Answers queries from</td><td>The internet</td><td>Only VPCs <strong>associated</strong> with the zone (any account or Region, via authorisation)</td></tr>
<tr><td>Typical names</td><td><code>example.com</code>, <code>www</code>, <code>api</code></td><td><code>db.internal.example.com</code>, <code>corp.local</code></td></tr>
<tr><td>Requirements</td><td>Delegate from the registrar (NS records)</td><td>VPC attributes <strong>enableDnsSupport</strong> and <strong>enableDnsHostnames</strong> set to true</td></tr>
</tbody></table>
<p>Pricing basics: a monthly fee per hosted zone plus a per-million-queries charge. <strong>Alias queries to AWS resources are free.</strong></p>

<h3>Alias records: the AWS answer to CNAME-at-apex</h3>
<ul>
  <li>An <strong>alias record</strong> is a Route 53 extension. It's stored as an A or AAAA record (so it's valid <strong>at the zone apex</strong>), but instead of a fixed IP it points at an AWS resource. Route 53 resolves the resource's current IPs at query time.</li>
  <li>Alias targets include <strong>Elastic Load Balancers, CloudFront distributions, API Gateway, S3 static-website endpoints, Global Accelerator, Elastic Beanstalk environments, VPC interface endpoints</strong> and <strong>another record in the same hosted zone</strong>. You <em>can't</em> alias to an EC2 instance's DNS name or to an arbitrary external hostname.</li>
  <li>Alias queries to AWS resources are <strong>not charged</strong>, CNAME queries are. You don't set a TTL on an alias; Route 53 uses the target's.</li>
  <li>Alias records can "evaluate target health", so they integrate with failover routing.</li>
</ul>
<table>
<thead><tr><th></th><th>CNAME</th><th>Alias</th></tr></thead>
<tbody>
<tr><td>Zone apex (<code>example.com</code>)</td><td>❌ Not allowed</td><td>✅ Allowed</td></tr>
<tr><td>Target</td><td>Any DNS name</td><td>Specific AWS resources, or a record in the same zone</td></tr>
<tr><td>Query charge</td><td>Charged</td><td>Free for AWS-resource targets</td></tr>
<tr><td>Standard DNS?</td><td>Yes, works with any provider</td><td>Route 53-specific</td></tr>
</tbody></table>

<h3>Routing policies (previewed here, covered in depth in M12)</h3>
<table>
<thead><tr><th>Policy</th><th>Behaviour</th><th>Use it when…</th></tr></thead>
<tbody>
<tr><td>Simple</td><td>Returns the record's value(s); no health checks on a simple record</td><td>A single resource</td></tr>
<tr><td>Weighted</td><td>Splits responses by weight (e.g. 90/10)</td><td>Canary/blue-green releases, gradual migration</td></tr>
<tr><td>Latency-based</td><td>Answers with the Region that has the lowest latency for the user</td><td>Multi-Region apps optimising performance</td></tr>
<tr><td>Failover</td><td>Primary while healthy, secondary when its health check fails</td><td>Active-passive disaster recovery</td></tr>
<tr><td>Geolocation</td><td>By the user's continent/country/state, with a default record</td><td>Compliance, localisation, content rights</td></tr>
<tr><td>Geoproximity</td><td>By distance, adjustable with a <em>bias</em></td><td>Shifting more or less traffic towards a Region</td></tr>
<tr><td>Multivalue answer</td><td>Up to 8 healthy records, chosen randomly</td><td>Simple client-side load spreading with health checks (not a load balancer replacement)</td></tr>
<tr><td>IP-based</td><td>By the client's source IP range (CIDR collections)</td><td>Routing known ISP or customer networks to specific endpoints</td></tr>
</tbody></table>
<p><strong>Health checks</strong> monitor an endpoint (HTTP/HTTPS/TCP from checkers around the world), other health checks (<em>calculated</em>), or a <strong>CloudWatch alarm</strong>. Because the checkers are on the internet, use a CloudWatch-alarm-based health check for <strong>private</strong> resources.</p>

<h3>Route 53 Resolver (VPC DNS) and hybrid DNS</h3>
<ul>
  <li>Every VPC gets a Resolver at the <strong>VPC CIDR base +2</strong> (and <code>169.254.169.253</code>). Instances can't reach it from outside the VPC directly.</li>
  <li><strong>Inbound endpoint:</strong> on-premises → AWS. On-prem DNS servers conditionally forward <code>aws.example.com</code> to the endpoint IPs, so on-prem clients can resolve private hosted zones.</li>
  <li><strong>Outbound endpoint + forwarding rules:</strong> AWS → on-premises. A rule such as "forward <code>corp.example.com</code> to 192.168.10.53" lets EC2 resolve on-prem names. Rules can be shared across accounts with AWS RAM.</li>
  <li>VPC attributes: <strong>enableDnsSupport</strong> (the Resolver works at all) and <strong>enableDnsHostnames</strong> (instances with public IPs get public DNS names; also required for private hosted zones and for private DNS on interface endpoints).</li>
  <li><strong>Resolver DNS Firewall</strong> can block queries to known-bad domains (data exfiltration over DNS). Resolver query logging records what was resolved.</li>
  <li>Route 53 supports <strong>DNSSEC signing</strong> for public hosted zones and <strong>DNSSEC validation</strong> in the Resolver.</li>
</ul>` },

    { type: "examples", title: "Worked examples with dig", html: `
<p><code>dig</code> (from the <code>dnsutils</code>/<code>bind-utils</code> package) is the architect's DNS stethoscope. The outputs below are realistic examples, with the parts that matter annotated.</p>

<h3>1. A basic lookup</h3>
<pre><code>$ dig www.example.com A

;; -&gt;&gt;HEADER&lt;&lt;- opcode: QUERY, status: NOERROR, id: 40211      &lt;- NOERROR = success
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1
;;   rd = recursion desired (we asked), ra = recursion available (resolver agreed)
;;   no "aa" flag -&gt; this answer came from a resolver's cache, not the authority

;; ANSWER SECTION:
www.example.com.        287     IN      A       203.0.113.25
;;                      ^^^ remaining TTL in the resolver's cache (it started at 300)

;; Query time: 3 msec                                           &lt;- fast = cached
;; SERVER: 10.0.0.2#53(10.0.0.2) (UDP)                          &lt;- the VPC +2 Resolver</code></pre>

<h3>2. Following the delegation chain with +trace</h3>
<pre><code>$ dig +trace www.example.com
.                   518400  IN  NS  a.root-servers.net.        &lt;- step 2-3: root servers
...
com.                172800  IN  NS  a.gtld-servers.net.        &lt;- referral from root to .com
...
example.com.        172800  IN  NS  ns-1234.awsdns-26.org.     &lt;- referral from .com to Route 53
example.com.        172800  IN  NS  ns-567.awsdns-07.net.
example.com.        172800  IN  NS  ns-89.awsdns-11.com.
example.com.        172800  IN  NS  ns-1890.awsdns-44.co.uk.
...
www.example.com.    300     IN  A   203.0.113.25               &lt;- final answer from the authority
;; Received 60 bytes from 205.251.196.210#53(ns-1234.awsdns-26.org) in 21 ms</code></pre>
<p>+trace bypasses caches and asks each level itself. Use it to prove a delegation is correct after changing name servers at a registrar.</p>

<h3>3. Asking a specific server, and asking the authority directly</h3>
<pre><code>$ dig @8.8.8.8 shop.example.com +short          # what Google's public resolver currently caches
203.0.113.25
$ dig @ns-89.awsdns-11.com shop.example.com +short   # what the authority says right now
198.51.100.40</code></pre>
<p>Different answers? The authority has the <strong>new</strong> value, and 8.8.8.8 is serving the <strong>old</strong> one from cache until its TTL expires. That's "propagation" in action.</p>

<h3>4. Mail, text and reverse records</h3>
<pre><code>$ dig example.com MX +short
10 mx1.example.com.          &lt;- tried first (lower = preferred)
20 mx2.example.com.          &lt;- backup

$ dig example.com TXT +short
"v=spf1 include:amazonses.com -all"
"google-site-verification=3kd9...x0"

$ dig -x 203.0.113.25 +short     # reverse (PTR) lookup
www.example.com.

$ dig example.com SOA +short
ns-89.awsdns-11.com. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400
#  primary NS          admin email (@ -&gt; .)        |  |    |   |       '- negative-cache TTL (s)
#                                                serial | retry  expire
#                                                    refresh</code></pre>

<h3>5. Spotting a CNAME chain and an apex alias</h3>
<pre><code>$ dig www.example.com +short
d111111abcdef8.cloudfront.net.     &lt;- www is a CNAME to CloudFront
18.66.2.10
18.66.2.84

$ dig example.com +short           &lt;- apex: an alias A record; you see IPs, never a CNAME
18.66.2.10
18.66.2.84</code></pre>

<h3>6. TTL arithmetic</h3>
<p>A record has TTL 3,600 s. At 10:00 a resolver caches it. At 10:20 you change the record. That resolver will keep returning the old value until <strong>11:00</strong> (cached at 10:00 + 3,600 s). A resolver that cached it at 10:19 returns the old value until 11:19. So the worst case after a change is <strong>one full TTL</strong> from the moment of the change.</p>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>What you'd choose</th><th>Why</th></tr></thead>
<tbody>
<tr><td><code>example.com</code> (apex) must point to an Application Load Balancer</td><td>Route 53 <strong>alias A</strong> record to the ALB</td><td>CNAME is illegal at the apex; ALB IPs change; alias queries are free</td></tr>
<tr><td>Internal service names for apps in several VPCs</td><td><strong>Private hosted zone</strong> associated with each VPC</td><td>Names resolve only inside the VPCs, invisible to the internet</td></tr>
<tr><td>EC2 must resolve <code>corp.example.com</code> hosted on on-prem AD DNS</td><td>Resolver <strong>outbound endpoint</strong> + forwarding rule</td><td>Sends just that domain's queries to on-prem DNS over VPN/DX</td></tr>
<tr><td>Office users must resolve AWS private zone names</td><td>Resolver <strong>inbound endpoint</strong>, with conditional forwarders on-prem</td><td>Gives on-prem DNS a target inside the VPC</td></tr>
<tr><td>Send 10% of users to a new version</td><td><strong>Weighted</strong> records 90/10</td><td>Gradual, reversible traffic shift</td></tr>
<tr><td>Prove domain ownership to issue an ACM certificate</td><td>The <strong>CNAME</strong> record ACM gives you (DNS validation)</td><td>Automatic renewals while the record stays in place</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: explore DNS yourself", html: `
<p>Install the tools in WSL/Ubuntu with <code>sudo apt-get install -y dnsutils</code>. AWS CloudShell already has <code>dig</code>, or you can run <code>sudo dnf install -y bind-utils</code>.</p>
<ol>
  <li>Which resolver are you using? <code>cat /etc/resolv.conf</code> (in WSL it's usually your Windows host; in CloudShell or EC2 it's the VPC Resolver).</li>
  <li>Run <code>dig aws.amazon.com</code> twice. Compare the TTL and the query time between the two runs. The second run is cached.</li>
  <li>Run <code>dig +trace aws.amazon.com</code> and identify the root, TLD and authoritative steps.</li>
  <li>Find a company's mail providers: <code>dig amazon.com MX +short</code>, and its SPF policy: <code>dig amazon.com TXT +short | grep spf</code>.</li>
  <li>Check who may issue certificates: <code>dig amazon.com CAA +short</code>.</li>
  <li>Reverse-lookup a public resolver: <code>dig -x 8.8.8.8 +short</code>.</li>
  <li>Compare resolvers: <code>dig @1.1.1.1 example.com +short</code> vs <code>dig @8.8.8.8 example.com +short</code>.</li>
  <li>See a negative answer: <code>dig doesnotexist-12345.example.com</code>. Note <code>status: NXDOMAIN</code> and the SOA in the AUTHORITY section.</li>
</ol>
<p>Optional, with cost: a Route 53 hosted zone costs a small monthly fee (prorated only for zones deleted within 12 hours). If you own a domain, create a hosted zone, add a TXT record, and query it with <code>dig @&lt;one of the zone's NS&gt; yourdomain TXT</code> before you even delegate it.</p>` },

    { type: "casestudy", title: "Case study: a zero-downtime website migration to AWS", html: `
<p><strong>Company:</strong> Fernleaf Outdoor, a mid-size online retailer. The site <code>fernleafoutdoor.example</code> ran in a colocation facility. DNS was hosted at the registrar with a default TTL of 86,400 s (24 h).</p>
<p><strong>Requirements:</strong> move the site to an Application Load Balancer + Auto Scaling group in <code>eu-west-1</code>; no downtime; the ability to roll back within minutes; <strong>email must keep working</strong> (Microsoft 365, MX and TXT records); the apex domain must serve the site.</p>
<p><strong>Plan and execution:</strong></p>
<table>
<thead><tr><th>When</th><th>Action</th><th>Reason</th></tr></thead>
<tbody>
<tr><td>T−7 days</td><td>Export the zone from the registrar. Create a Route 53 public hosted zone and import <em>every</em> record (A, MX, TXT for SPF/DKIM/DMARC, verification TXT, CNAMEs). Verify each one with <code>dig @ns-xxx.awsdns-xx.com</code>.</td><td>Move DNS hosting first, separately from moving the app</td></tr>
<tr><td>T−6 days</td><td>Change the name servers at the registrar to the four Route 53 NS. Keep the old DNS host's records unchanged for 48 h.</td><td>The NS records at the TLD have a long TTL (often 48 h). Both old and new hosts give identical answers during the overlap.</td></tr>
<tr><td>T−2 days</td><td>Lower the TTL of <code>www</code> and the apex to <strong>60 s</strong></td><td>Wait longer than the old 24 h TTL so all caches pick up the short TTL</td></tr>
<tr><td>T−0</td><td>Create <strong>weighted</strong> alias records: old site (an A record to the colo IP) weight 90, ALB weight 10. Watch errors and conversion.</td><td>Canary: a real but limited blast radius</td></tr>
<tr><td>T+2 h</td><td>Shift to 50/50, then 0/100</td><td>Rollback = change one weight, effective within about 60 s</td></tr>
<tr><td>T+3 days</td><td>Replace the weighted records with a simple alias at the apex and <code>www</code>. Raise TTLs (alias inherits the target's). Decommission the colo servers after a week of zero traffic in their logs.</td><td>Some clients cache longer than the TTL</td></tr>
</tbody></table>
<p><strong>What went wrong (and was caught):</strong> the first zone import missed the DKIM <code>selector2._domainkey</code> CNAME. A test email from the staging check showed a DKIM failure in the headers <em>before</em> the NS change, so the record was added and no mail was lost.</p>
<p><strong>Result:</strong> no customer-visible downtime; the rollback path was never needed; DNS query costs dropped because the apex and <code>www</code> became alias records.</p>
<p><strong>Lessons learned:</strong> (1) separate "move DNS" from "move the app"; (2) lower TTLs one full old-TTL period ahead; (3) inventory email records, since they're the most commonly forgotten; (4) weighted records turn a risky cut-over into a gradual, reversible one; (5) verify against the <em>authoritative</em> servers, not your cached resolver.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>Keyword in the question</th><th>Likely answer</th></tr></thead>
<tbody>
<tr><td>"Zone apex", "naked domain", "example.com to an ALB/CloudFront/S3 website"</td><td>Route 53 <strong>alias record</strong></td></tr>
<tr><td>"Map a name to another name" (not at the apex, non-AWS target)</td><td>CNAME</td></tr>
<tr><td>"Resolve names only inside the VPC"</td><td><strong>Private hosted zone</strong> + enableDnsSupport/enableDnsHostnames</td></tr>
<tr><td>"On-premises must resolve AWS private names"</td><td>Resolver <strong>inbound</strong> endpoint</td></tr>
<tr><td>"EC2 must resolve on-premises names"</td><td>Resolver <strong>outbound</strong> endpoint + forwarding rules</td></tr>
<tr><td>"Changes take too long to take effect"</td><td>The TTL is too high. Lower it before the change.</td></tr>
<tr><td>"Route users to the Region with the lowest latency"</td><td>Latency-based routing</td></tr>
<tr><td>"Active-passive DR"</td><td>Failover routing + health checks</td></tr>
<tr><td>"Send a percentage of traffic"</td><td>Weighted routing</td></tr>
<tr><td>"Users in a country must see country-specific content"</td><td>Geolocation routing</td></tr>
<tr><td>"Protect against DNS spoofing"</td><td>DNSSEC</td></tr>
</tbody></table>
<p><strong>Common distractors:</strong> a CNAME at the apex; an A record with an ALB's current IPs (they change); the <em>outbound</em> endpoint for on-prem → AWS queries (that's inbound); multivalue answer presented as a load balancer; geolocation when the requirement is <em>latency</em> (and vice versa); an endpoint health check for a private resource (use a CloudWatch alarm).</p>` },

    { type: "architect", html: `
<ul>
  <li><strong>Troubleshooting order:</strong> (1) <code>dig @authoritative</code>: is the record right at the source? (2) <code>dig +trace</code>: is the delegation right (registrar NS = hosted zone NS)? (3) <code>dig @resolver</code>: is a stale cached or negative answer still being served? (4) In a VPC: is the private zone associated, are enableDnsSupport/Hostnames on, and does a forwarding rule override the name?</li>
  <li><strong>Overlapping private zones:</strong> if a private hosted zone <code>example.com</code> is associated with a VPC, names <em>not</em> in that zone don't fall through to the public zone. They return NXDOMAIN inside the VPC. Use a sub-domain (<code>internal.example.com</code>) or replicate the public records you need.</li>
  <li><strong>Custom DNS servers:</strong> if you replace the DHCP options with your own DNS servers, you lose private hosted zones and VPC names unless those servers forward to the +2 Resolver. Prefer Resolver endpoints and rules over self-managed DNS on EC2.</li>
  <li><strong>Hybrid DNS at scale:</strong> centralise Resolver endpoints in a shared-services VPC, share the forwarding rules with AWS RAM, and associate private zones from every account with that VPC. Endpoints need ≥ 2 IPs in different AZs, and SGs allowing UDP+TCP 53.</li>
  <li><strong>TTL is a business decision:</strong> 60 s for records you might need to fail over; hours for stable records. Client caching (especially long-lived JVM caches) can defeat DNS failover, so set <code>networkaddress.cache.ttl</code> appropriately in Java apps.</li>
  <li><strong>Protect the registrar account</strong> (MFA, registrar lock, auto-renew). Losing a domain or having NS records hijacked takes everything down, including email.</li>
  <li><strong>Data exfiltration via DNS</strong> is real: queries such as <code>&lt;stolen-data&gt;.attacker.example</code>. Route 53 Resolver DNS Firewall and query logs give you visibility and control.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>DNS is a hierarchical, delegated and heavily <strong>cached</strong> database: root → TLD → authoritative, with NS records as the delegation glue.</li>
  <li>Stub → <strong>recursive resolver</strong> (recursive query) → root/TLD/authoritative (iterative queries). Resolvers cache answers, including negative answers, for their TTL.</li>
  <li>Know the record types: A/AAAA (IPs), CNAME (name → name, not at the apex), MX (lower priority wins), TXT (SPF/DKIM/DMARC/verification), NS, SOA (serial, negative TTL), PTR (reverse), SRV, CAA.</li>
  <li>Lower the TTL <strong>one old-TTL period before</strong> a change. "Propagation" is really cache expiry.</li>
  <li><strong>Route 53 alias</strong> solves CNAME-at-apex for AWS targets, and alias queries to AWS resources are free.</li>
  <li>Public vs <strong>private hosted zones</strong>. Private zones need enableDnsSupport and enableDnsHostnames.</li>
  <li>Routing policies: simple, weighted, latency, failover, geolocation, geoproximity, multivalue, IP-based.</li>
  <li>Hybrid: <strong>inbound endpoint</strong> = on-prem asks AWS; <strong>outbound endpoint + rules</strong> = AWS asks on-prem. DNS uses UDP <em>and</em> TCP 53.</li>
</ul>` }
  ],
  drills: [
    { id: "M02.04-d1", q: "Which record <em>type</em> stores an IPv6 address?", answers: ["AAAA", "quad-a", "quad a"], explain: "A = IPv4, AAAA = IPv6." },
    { id: "M02.04-d2", q: "MX records: <code>MX 20 mx-b.example.com.</code> and <code>MX 5 mx-a.example.com.</code>. Which host does a sending server try first?", answers: ["mx-a.example.com", "mx-a.example.com.", "mx-a"], hint: "Is a lower or higher number preferred?", explain: "The lowest preference value wins, so priority 5 (mx-a) is tried first." },
    { id: "M02.04-d3", q: "A record's TTL is 86,400 seconds. You plan to change it. At minimum, how many <strong>hours</strong> before the change should you lower the TTL, so that no resolver still holds a 24-hour cached copy?", answers: ["24", "24h", "24hours"], explain: "Caches that fetched the record just before you lowered the TTL keep it for up to 86,400 s = 24 h. Wait that long, then make the change." },
    { id: "M02.04-d4", q: "A VPC uses CIDR <code>10.20.0.0/16</code>. What is the IPv4 address of its Route 53 Resolver (the \"+2\" address)?", answers: ["10.20.0.2"], explain: "The VPC's base network address plus two: 10.20.0.0 + 2 = 10.20.0.2. 169.254.169.253 also works from inside the VPC." },
    { id: "M02.04-d5", q: "Which record type restricts which certificate authorities may issue certificates for your domain?", answers: ["CAA"], explain: "CAA (Certification Authority Authorization). For ACM, it must allow amazon.com (or amazontrust.com, awstrust.com, amazonaws.com)." },
    { id: "M02.04-d6", q: "Which record type does a reverse lookup (<code>dig -x 203.0.113.25</code>) return?", answers: ["PTR"], explain: "Reverse DNS uses PTR records in the in-addr.arpa zone: 25.113.0.203.in-addr.arpa." },
    { id: "M02.04-d7", q: "A resolver cached a record (TTL 3,600 s) at 14:10. The record was changed at 14:30. Until what time (HH:MM) can that resolver keep returning the old value?", answers: ["15:10", "1510", "3:10pm", "15.10"], explain: "Cached at 14:10 + 1 hour = 15:10. When the change was made doesn't matter to that cache." }
  ],
  check: [
    { id: "M02.04-k1", type: "single", domain: "D2", task: "2.2", level: 200,
      stem: "A company hosts <code>example.com</code> in Amazon Route 53. The apex domain <code>example.com</code> must route to an Application Load Balancer. What should the solutions architect configure?",
      options: [
        { t: "An alias A record at the apex that targets the ALB", c: true, why: "Alias records are allowed at the apex, follow the ALB's changing IPs, and queries to AWS targets are free." },
        { t: "A CNAME record at the apex pointing to the ALB DNS name", c: false, why: "A CNAME can't coexist with the SOA and NS records that must exist at the apex." },
        { t: "An A record containing the ALB's current IP addresses", c: false, why: "ALB IPs change over time, so the record would break." },
        { t: "An MX record pointing to the ALB", c: false, why: "MX records are for mail servers." }
      ] },
    { id: "M02.04-k2", type: "single", domain: "D1", task: "1.2", level: 200,
      stem: "Servers in a corporate data centre, connected to a VPC over AWS Direct Connect, must resolve records in a Route 53 private hosted zone associated with that VPC. Which solution meets this requirement?",
      options: [
        { t: "Create a Route 53 Resolver inbound endpoint in the VPC and configure the on-premises DNS servers to conditionally forward the zone's domain to the endpoint IPs", c: true, why: "Inbound endpoints let on-premises resolvers query the VPC's Resolver, which can answer for associated private zones." },
        { t: "Create a Route 53 Resolver outbound endpoint and a forwarding rule", c: false, why: "Outbound is the other direction: VPC resources resolving on-premises names." },
        { t: "Convert the private hosted zone to a public hosted zone", c: false, why: "That exposes internal names to the internet, which is a security regression." },
        { t: "Point the on-premises DNS servers at the VPC's +2 Resolver address over Direct Connect", c: false, why: "The +2 Resolver only accepts queries from inside the VPC. Use an inbound endpoint." }
      ] },
    { id: "M02.04-k3", type: "multi", domain: "D1", task: "1.2", level: 200,
      stem: "A newly created private hosted zone is associated with a VPC, but instances in the VPC can't resolve its records. Which TWO VPC settings must be enabled?",
      options: [
        { t: "<code>enableDnsSupport</code>", c: true, why: "Turns on the Amazon-provided DNS (Route 53 Resolver) for the VPC." },
        { t: "<code>enableDnsHostnames</code>", c: true, why: "Required (with DNS support) for private hosted zones to resolve in the VPC." },
        { t: "A DHCP option set pointing to 8.8.8.8", c: false, why: "A public resolver can't see your private zone. This would break private resolution." },
        { t: "An internet gateway attached to the VPC", c: false, why: "Private DNS resolution doesn't need internet access." },
        { t: "IPv6 on all subnets", c: false, why: "Unrelated to private hosted zone resolution." }
      ] },
    { id: "M02.04-k4", type: "single", domain: "D2", task: "2.1", level: 200,
      stem: "A team updated an A record to point to a new server, but many users still reach the old server several hours later. The record's TTL is 86,400 seconds. What should the team have done to avoid this?",
      options: [
        { t: "Lowered the record's TTL at least 24 hours before the change, then raised it after the change", c: true, why: "Resolvers cache for the TTL. Lowering it one old-TTL period in advance makes the switch take effect quickly." },
        { t: "Used a CNAME instead of an A record", c: false, why: "CNAMEs are cached by TTL too. The record type doesn't fix caching." },
        { t: "Enabled DNSSEC on the hosted zone", c: false, why: "DNSSEC provides authenticity. It doesn't affect cache duration." },
        { t: "Moved the domain registration to Route 53", c: false, why: "The registrar doesn't affect record caching." }
      ] },
    { id: "M02.04-k5", type: "single", domain: "D2", task: "2.2", level: 200,
      stem: "A company wants to send 10% of users to a new application stack behind a second load balancer and gradually increase the share, with the ability to roll back quickly. Which Route 53 routing policy should they use?",
      options: [
        { t: "Weighted routing", c: true, why: "Weights (e.g. 90/10) split DNS responses proportionally and can be changed at any time." },
        { t: "Latency-based routing", c: false, why: "That chooses by network latency, not a controlled percentage." },
        { t: "Failover routing", c: false, why: "Failover is active-passive. The secondary receives traffic only when the primary is unhealthy." },
        { t: "Geolocation routing", c: false, why: "That routes by user location, not by percentage." }
      ] },
    { id: "M02.04-k6", type: "single", domain: "D1", task: "1.3", level: 200,
      stem: "AWS Certificate Manager (ACM) fails to issue a certificate for <code>shop.example.com</code> even though DNS validation records are in place. The domain has existing CAA records. What is the MOST likely cause?",
      options: [
        { t: "The CAA records don't authorise Amazon as a certificate authority", c: true, why: "When CAA records exist, a CA may issue only if it's listed. ACM requires amazon.com (or its other Amazon CA domains) to be allowed." },
        { t: "The domain's MX records point to another provider", c: false, why: "MX records don't affect certificate issuance." },
        { t: "The hosted zone is public", c: false, why: "DNS validation requires the record to be publicly resolvable, so a public zone is correct." },
        { t: "The record TTL is too low", c: false, why: "A low TTL doesn't prevent issuance." }
      ] }
  ],
  cards: ["fc-M02-4-01", "fc-M02-4-02", "fc-M02-4-03", "fc-M02-4-04", "fc-M02-4-05", "fc-M02-4-06", "fc-M02-4-07", "fc-M02-4-08", "fc-M02-4-09", "fc-M02-4-10", "fc-M02-4-11", "fc-M02-4-12"],
  references: [
    "<em>System Design on AWS</em> ch.6 \"Communication Networks &amp; Protocols\" (DNS section, PDF p247–299)",
    "Amazon Route 53 Developer Guide: <em>Choosing between alias and non-alias records</em>, <em>Choosing a routing policy</em>, <em>Working with private hosted zones</em>",
    "Amazon Route 53 Developer Guide: <em>Resolving DNS queries between VPCs and your network</em> (Resolver endpoints)",
    "AWS whitepaper: <em>Hybrid Cloud DNS Options for Amazon VPC</em>",
    "RFC 1034/1035 (DNS), RFC 2308 (negative caching), RFC 8659 (CAA), RFC 4033 (DNSSEC)"
  ]
});

FLASHCARDS.push(
  { id: "fc-M02-4-01", front: "Recursive resolver vs authoritative server?", back: "Recursive: finds answers for clients by following referrals, and caches them (ISP, 8.8.8.8, VPC +2 Resolver). Authoritative: holds the zone's records and answers definitively (Route 53 hosted zone)." },
  { id: "fc-M02-4-02", front: "Order of servers in a full DNS resolution?", back: "Stub → recursive resolver → <strong>root</strong> (referral to TLD) → <strong>TLD</strong> (referral to the zone's NS) → <strong>authoritative</strong> (answer). Cached for the TTL." },
  { id: "fc-M02-4-03", front: "Why can't you use a CNAME at the zone apex?", back: "The apex must have SOA and NS records, and a CNAME can't coexist with any other record at the same name. On Route 53, use an <strong>alias</strong> record." },
  { id: "fc-M02-4-04", front: "Alias vs CNAME: three differences?", back: "Alias: allowed at the apex, free queries to AWS targets, AWS targets only (ELB, CloudFront, S3 website, API GW, GA, VPC endpoint, same-zone record). CNAME: not at the apex, charged, any target." },
  { id: "fc-M02-4-05", front: "MX priority: which wins, 10 or 20?", back: "<strong>10</strong>. The lower value is preferred. 20 is the backup." },
  { id: "fc-M02-4-06", front: "What are SPF, DKIM and DMARC, and which record type do they use?", back: "TXT records (DKIM is often delegated via CNAME). SPF = allowed senders; DKIM = signing public key; DMARC = policy and reporting when checks fail." },
  { id: "fc-M02-4-07", front: "What does the SOA's last (minimum) field control?", back: "The <strong>negative-caching TTL</strong>: how long resolvers cache NXDOMAIN (\"name doesn't exist\")." },
  { id: "fc-M02-4-08", front: "TTL rule for migrations?", back: "Lower the TTL (e.g. to 60 s) at least <strong>one old-TTL period</strong> before the change; switch; raise it again afterwards." },
  { id: "fc-M02-4-09", front: "Route 53 Resolver inbound vs outbound endpoint?", back: "<strong>Inbound:</strong> on-prem → AWS (on-prem resolves private zones). <strong>Outbound + forwarding rules:</strong> AWS → on-prem (EC2 resolves corporate names)." },
  { id: "fc-M02-4-10", front: "What's the VPC DNS resolver address?", back: "VPC base CIDR <strong>+2</strong> (e.g. 10.0.0.2), also 169.254.169.253. Needs enableDnsSupport. Private zones also need enableDnsHostnames." },
  { id: "fc-M02-4-11", front: "Which ports and protocols does DNS use?", back: "<strong>UDP 53</strong> for most queries; <strong>TCP 53</strong> for large/truncated responses and zone transfers. Allow both." },
  { id: "fc-M02-4-12", front: "Name the 8 Route 53 routing policies.", back: "Simple, weighted, latency-based, failover, geolocation, geoproximity, multivalue answer, IP-based." }
);

  // ================================================================== 05_protocols.js
/* M02.05 – TCP, UDP, HTTP(S) and TLS */
var DG_0205_HANDSHAKE = `
<figure>
<svg class="diagram" viewBox="0 0 760 470" role="img" aria-labelledby="dg0205at dg0205ad">
  <title id="dg0205at">TCP three-way handshake followed by a TLS 1.3 handshake</title>
  <desc id="dg0205ad">Client and server lifelines. The client sends SYN, the server answers SYN-ACK, the client sends ACK: one round trip. Then the client sends ClientHello with its key share, the server answers ServerHello, its key share, encrypted certificate, CertificateVerify and Finished, and the client sends Finished followed by the first HTTP request: one more round trip. Data then flows encrypted.</desc>
  <defs><marker id="dg0205a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-box" x="40" y="12" width="150" height="34" rx="6"/><text class="dg-tb" x="62" y="34">Client (browser)</text>
  <rect class="dg-box" x="570" y="12" width="150" height="34" rx="6"/><text class="dg-tb" x="590" y="34">Server (ALB / web)</text>
  <path class="dg-line" d="M115 46 V460 M645 46 V460" stroke-dasharray="3 4"/>

  <rect class="dg-info" x="230" y="56" width="300" height="20" rx="4"/><text class="dg-ta" x="292" y="71">TCP: 1 round trip (1 RTT)</text>
  <path class="dg-line" d="M115 92 L645 112" marker-end="url(#dg0205a-ar)"/><text class="dg-t" x="210" y="92">SYN  seq=x  (port 51514 → 443)</text>
  <path class="dg-line" d="M645 132 L115 152" marker-end="url(#dg0205a-ar)"/><text class="dg-t" x="330" y="132">SYN-ACK  seq=y, ack=x+1</text>
  <path class="dg-line" d="M115 172 L645 192" marker-end="url(#dg0205a-ar)"/><text class="dg-t" x="210" y="172">ACK  ack=y+1   → connection ESTABLISHED</text>

  <rect class="dg-edge" x="230" y="206" width="300" height="20" rx="4"/><text class="dg-ta" x="282" y="221">TLS 1.3: 1 more round trip</text>
  <path class="dg-line" d="M115 244 L645 264" marker-end="url(#dg0205a-ar)"/><text class="dg-t" x="160" y="244">ClientHello: versions, ciphers, key share, SNI</text>
  <path class="dg-line" d="M645 288 L115 298" marker-end="url(#dg0205a-ar)"/>
  <text class="dg-t" x="330" y="282">ServerHello + key share</text>
  <text class="dg-ts" x="330" y="316">{Certificate} {CertificateVerify} {Finished}</text>
  <text class="dg-ts" x="330" y="330">{ } = already encrypted with handshake keys</text>
  <path class="dg-line" d="M115 352 L645 372" marker-end="url(#dg0205a-ar)"/><text class="dg-t" x="160" y="352">{Finished} + first HTTP request (encrypted)</text>
  <path class="dg-line" d="M645 396 L115 416" marker-end="url(#dg0205a-ar)"/><text class="dg-t" x="330" y="396">HTTP response (encrypted)</text>

  <rect class="dg-good" x="110" y="430" width="540" height="26" rx="5"/>
  <text class="dg-t" x="124" y="448">Secure connection ready after 2 RTT · first response byte after 3 RTT</text>
</svg>
<figcaption>Figure M02-8. TCP opens the connection (1 RTT); TLS 1.3 secures it (1 RTT). The HTTP request/response then takes a third RTT. TLS 1.2 needs 2 RTT for its handshake (4 RTT to the first byte). HTTP/3 over QUIC merges transport and TLS set-up into 1 RTT.</figcaption>
</figure>`;

var DG_0205_TERM = `
<figure>
<svg class="diagram" viewBox="0 0 760 300" role="img" aria-labelledby="dg0205bt dg0205bd">
  <title id="dg0205bt">Three TLS termination options on AWS</title>
  <desc id="dg0205bd">Option 1: TLS terminates at an ALB and plain HTTP goes to the targets. Option 2: TLS terminates at the ALB and a new TLS session is opened to the targets (re-encryption). Option 3: an NLB with a TCP listener passes the encrypted stream to the targets, which terminate TLS themselves.</desc>
  <defs><marker id="dg0205b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <text class="dg-tb" x="12" y="22">1. Terminate at the load balancer (offload)</text>
  <rect class="dg-box" x="12" y="34" width="110" height="40" rx="6"/><text class="dg-t" x="38" y="59">Client</text>
  <rect class="dg-edge" x="300" y="34" width="150" height="40" rx="6"/><text class="dg-t" x="314" y="52">ALB HTTPS :443</text><text class="dg-ts" x="314" y="67">ACM cert, decrypts</text>
  <rect class="dg-box" x="620" y="34" width="128" height="40" rx="6"/><text class="dg-t" x="634" y="59">Targets :80</text>
  <path class="dg-line" d="M122 54 H298" marker-end="url(#dg0205b-ar)"/><text class="dg-ts" x="160" y="48">TLS (encrypted)</text>
  <path class="dg-line" d="M450 54 H618" marker-end="url(#dg0205b-ar)"/><text class="dg-ts" x="490" y="48">HTTP (plain text)</text>

  <text class="dg-tb" x="12" y="118">2. Terminate and re-encrypt (end-to-end encryption, L7 features kept)</text>
  <rect class="dg-box" x="12" y="130" width="110" height="40" rx="6"/><text class="dg-t" x="38" y="155">Client</text>
  <rect class="dg-edge" x="300" y="130" width="150" height="40" rx="6"/><text class="dg-t" x="314" y="148">ALB HTTPS :443</text><text class="dg-ts" x="314" y="163">decrypt, inspect, re-encrypt</text>
  <rect class="dg-box" x="620" y="130" width="128" height="40" rx="6"/><text class="dg-t" x="634" y="155">Targets :443</text>
  <path class="dg-line" d="M122 150 H298" marker-end="url(#dg0205b-ar)"/><text class="dg-ts" x="160" y="144">TLS session #1</text>
  <path class="dg-line" d="M450 150 H618" marker-end="url(#dg0205b-ar)"/><text class="dg-ts" x="490" y="144">TLS session #2</text>

  <text class="dg-tb" x="12" y="214">3. Passthrough (NLB TCP listener; targets hold the certificate)</text>
  <rect class="dg-box" x="12" y="226" width="110" height="40" rx="6"/><text class="dg-t" x="38" y="251">Client</text>
  <rect class="dg-info" x="300" y="226" width="150" height="40" rx="6"/><text class="dg-t" x="314" y="244">NLB TCP :443</text><text class="dg-ts" x="314" y="259">cannot read the bytes</text>
  <rect class="dg-box" x="620" y="226" width="128" height="40" rx="6"/><text class="dg-t" x="634" y="244">Targets :443</text><text class="dg-ts" x="634" y="259">own cert, mTLS ok</text>
  <path class="dg-line" d="M122 246 H618" marker-end="url(#dg0205b-ar)"/><text class="dg-ts" x="468" y="240">one TLS session</text>
  <text class="dg-ts" x="12" y="290">Trade-off: the deeper the LB looks into traffic (path routing, WAF, headers), the more it must decrypt.</text>
</svg>
<figcaption>Figure M02-9. Where TLS ends decides who can see the plaintext, where certificates live and which features the load balancer can offer.</figcaption>
</figure>`;

LESSONS.push({
  id: "M02.05", title: "TCP, UDP, HTTP(S) and TLS", level: 200, minutes: 55,
  objectives: [
    "Identify the ports and transport protocols of common services and write precise security group rules for them",
    "Trace a TCP connection from three-way handshake to teardown and explain how idle timeouts break long-lived connections",
    "Read an HTTP exchange, interpret 4xx/5xx status codes from a load balancer and choose between REST, WebSockets and gRPC",
    "Describe the TLS 1.2 and 1.3 handshakes, certificate chains, SNI and mTLS",
    "Choose a TLS termination design (offload, re-encrypt, passthrough) and the matching AWS load balancer and certificate source"
  ],
  sections: [
    { type: "why", html: `
<p>A support ticket says: <em>"Users get logged out of our chat app every minute, and the dashboard shows 504 errors."</em> The servers are healthy and CPU is at 10%. The cause is at the protocol level: the load balancer closes connections that have been idle longer than its idle timeout, and the application gives up waiting for a response before the backend sends one.</p>
<p>Almost every architecture decision touches this layer. Security group rules are written as <strong>protocol + port</strong>. Choosing an ALB or an NLB means choosing between <strong>Layer 7 HTTP</strong> and <strong>Layer 4 TCP/UDP</strong>. "Encrypt data in transit" means <strong>TLS</strong>, and deciding <em>where TLS terminates</em> decides who can read your traffic. The exam tests all of this through scenarios, and in production you will debug it at 2 a.m. with <code>curl -v</code>.</p>` },

    { type: "concept", title: "Ports, sockets and the transport layer", html: `
<p>IP (Layer 3) gets a packet to the right <em>machine</em>. The transport layer (Layer 4) gets it to the right <em>program</em> on that machine. It does this with <strong>port numbers</strong>, 16-bit values from 0 to 65535.</p>
<table>
<thead><tr><th>Range</th><th>Name</th><th>Who uses it</th></tr></thead>
<tbody>
<tr><td>0–1023</td><td>Well-known (system) ports</td><td>Standard services: 22 SSH, 53 DNS, 80 HTTP, 443 HTTPS. On Linux, binding them needs root or the <code>CAP_NET_BIND_SERVICE</code> capability.</td></tr>
<tr><td>1024–49151</td><td>Registered ports</td><td>Vendor services: 3306 MySQL, 5432 PostgreSQL, 6379 Redis</td></tr>
<tr><td>49152–65535</td><td>Dynamic / ephemeral (IANA)</td><td>Temporary <em>client-side</em> ports chosen by the OS for outgoing connections</td></tr>
</tbody></table>
<div class="callout warn"><strong>Ephemeral ranges differ by OS.</strong> Linux uses 32768–60999 by default (<code>/proc/sys/net/ipv4/ip_local_port_range</code>). Windows uses 49152–65535. Elastic Load Balancing and NAT gateways use 1024–65535. That is why AWS recommends allowing <strong>1024–65535</strong> for return traffic in a stateless network ACL.</div>
<h3>The 5-tuple</h3>
<p>A connection (or "flow") is uniquely identified by five values: <strong>protocol, source IP, source port, destination IP, destination port</strong>. For example: <code>TCP 203.0.113.7:51514 → 10.0.1.25:443</code>. Firewalls, NAT devices, load balancers and VPC Flow Logs all reason in 5-tuples. When your laptop opens two browser tabs to the same site, the destination is identical but each tab gets a different ephemeral source port, so the flows stay separate.</p>
<h3>Ports architects must know</h3>
<table>
<thead><tr><th>Port</th><th>Protocol</th><th>Service</th><th>Where you meet it on AWS</th></tr></thead>
<tbody>
<tr><td>22</td><td>TCP</td><td>SSH</td><td>Linux admin access. Prefer Session Manager, which needs no inbound port.</td></tr>
<tr><td>53</td><td>UDP and TCP</td><td>DNS</td><td>Route 53, Route 53 Resolver endpoints. TCP is used for large responses and zone transfers.</td></tr>
<tr><td>80 / 443</td><td>TCP (443 also UDP for HTTP/3)</td><td>HTTP / HTTPS</td><td>ALB, CloudFront, API Gateway</td></tr>
<tr><td>3389</td><td>TCP</td><td>RDP</td><td>Windows admin access (Fleet Manager can replace it)</td></tr>
<tr><td>3306</td><td>TCP</td><td>MySQL / MariaDB / Aurora MySQL</td><td>RDS security groups</td></tr>
<tr><td>5432</td><td>TCP</td><td>PostgreSQL / Aurora PostgreSQL</td><td>RDS security groups</td></tr>
<tr><td>1433</td><td>TCP</td><td>Microsoft SQL Server</td><td>RDS for SQL Server</td></tr>
<tr><td>1521</td><td>TCP</td><td>Oracle</td><td>RDS for Oracle</td></tr>
<tr><td>6379</td><td>TCP</td><td>Redis / Valkey</td><td>ElastiCache, MemoryDB</td></tr>
<tr><td>11211</td><td>TCP</td><td>Memcached</td><td>ElastiCache for Memcached</td></tr>
<tr><td>2049</td><td>TCP</td><td>NFS</td><td>Amazon EFS, FSx for OpenZFS / NetApp ONTAP</td></tr>
<tr><td>445</td><td>TCP</td><td>SMB</td><td>FSx for Windows File Server, File Gateway (SMB)</td></tr>
<tr><td>25 / 587</td><td>TCP</td><td>SMTP / SMTP submission</td><td>Amazon SES. Outbound port 25 from EC2 is throttled by default.</td></tr>
<tr><td>500 / 4500</td><td>UDP</td><td>IKE / IPsec NAT traversal</td><td>Site-to-Site VPN</td></tr>
<tr><td>179</td><td>TCP</td><td>BGP</td><td>Direct Connect, dynamic VPN routing</td></tr>
<tr><td>9092 (9094 TLS)</td><td>TCP</td><td>Apache Kafka</td><td>Amazon MSK</td></tr>
<tr><td>27017</td><td>TCP</td><td>MongoDB</td><td>Amazon DocumentDB</td></tr>
</tbody></table>
<h3>TCP: reliable, ordered byte streams</h3>
<p><strong>TCP (Transmission Control Protocol)</strong> gives applications the illusion of a reliable pipe over an unreliable network:</p>
<ul>
  <li><strong>Connection-oriented:</strong> both ends agree to talk (the handshake) before sending data.</li>
  <li><strong>Sequence numbers and acknowledgements (ACKs):</strong> every byte is numbered. The receiver acknowledges what it has received, so lost segments are detected and <strong>retransmitted</strong>, and out-of-order segments are reassembled in order.</li>
  <li><strong>Flow control</strong> protects the <em>receiver</em>. The receiver advertises a window ("I have room for 64 KB more"), and the sender never exceeds it.</li>
  <li><strong>Congestion control</strong> protects the <em>network</em>. The sender starts slowly (slow start), increases its sending rate until it sees loss or delay, then backs off (algorithms such as CUBIC or BBR). That is why a new connection is slower than a warmed-up one, and why connection reuse matters.</li>
  <li><strong>Teardown:</strong> a graceful close is a FIN from each side, each acknowledged. An abrupt close is a <strong>RST</strong> (reset), sent when a port is closed, a firewall rejects the connection, or a connection is torn down after a timeout.</li>
  <li><strong>Keep-alive:</strong> TCP keep-alive probes (and HTTP keep-alive, which reuses a connection for many requests) stop idle connections being silently dropped by middleboxes, and avoid paying for a handshake on every request.</li>
</ul>
<h3>UDP: fast, connectionless datagrams</h3>
<p><strong>UDP (User Datagram Protocol)</strong> sends independent datagrams with no handshake, no ordering, no retransmission and no congestion control. The application decides what to do about loss. That is exactly what you want when a late packet is useless anyway:</p>
<ul>
  <li><strong>DNS:</strong> a tiny question and answer. A handshake would double the latency.</li>
  <li><strong>Voice/video (VoIP, WebRTC) and online games:</strong> a retransmitted frame from 300 ms ago is worse than a skipped one.</li>
  <li><strong>Telemetry and syslog, IoT sensors:</strong> high volume, loss-tolerant.</li>
  <li><strong>QUIC / HTTP/3:</strong> builds its own reliability and encryption on top of UDP, in user space.</li>
</ul>
<table>
<thead><tr><th></th><th>TCP</th><th>UDP</th></tr></thead>
<tbody>
<tr><td>Connection</td><td>Handshake first (1 RTT)</td><td>None</td></tr>
<tr><td>Reliability / ordering</td><td>Guaranteed by the protocol</td><td>None (application's job)</td></tr>
<tr><td>Header size</td><td>20–60 bytes</td><td>8 bytes</td></tr>
<tr><td>Congestion control</td><td>Yes</td><td>No (application's job)</td></tr>
<tr><td>Typical uses</td><td>HTTP/1.1–2, databases, SSH, file transfer</td><td>DNS, VoIP, gaming, streaming telemetry, QUIC</td></tr>
<tr><td>AWS load balancer</td><td>ALB (HTTP over TCP), NLB (TCP, TLS)</td><td><strong>NLB only</strong> (UDP, TCP_UDP listeners)</td></tr>
</tbody></table>` + DG_0205_HANDSHAKE },

    { type: "concept", title: "HTTP: the application protocol of the web", html: `
<p><strong>HTTP (Hypertext Transfer Protocol)</strong> is a request/response protocol. A client sends a <em>request</em> (method, path, headers, optional body), and the server returns a <em>response</em> (status code, headers, optional body).</p>
<pre><code>GET /api/orders/42 HTTP/1.1          ← method, path, version
Host: shop.example.com                ← REQUIRED in HTTP/1.1; how one IP serves many sites
Accept: application/json
Authorization: Bearer eyJhbGciOi...
Cookie: session=7f3a9c                 ← state the server set earlier

HTTP/1.1 200 OK                        ← status line
Content-Type: application/json
Cache-Control: max-age=60              ← caches (browser, CloudFront) may reuse for 60 s
Set-Cookie: AWSALB=...; Path=/         ← e.g. ALB stickiness cookie

{"id":42,"status":"shipped"}</code></pre>
<h3>Methods and idempotency</h3>
<table>
<thead><tr><th>Method</th><th>Purpose</th><th>Safe (no side effects)?</th><th>Idempotent (repeat = same result)?</th></tr></thead>
<tbody>
<tr><td>GET / HEAD</td><td>Read</td><td>Yes</td><td>Yes</td></tr>
<tr><td>PUT</td><td>Create or replace at a known URL</td><td>No</td><td>Yes</td></tr>
<tr><td>DELETE</td><td>Remove</td><td>No</td><td>Yes</td></tr>
<tr><td>POST</td><td>Create / run an action</td><td>No</td><td><strong>No</strong></td></tr>
<tr><td>PATCH</td><td>Partial update</td><td>No</td><td>Not necessarily</td></tr>
</tbody></table>
<p>Idempotency matters for <strong>retries</strong>. Clients, SDKs and load balancers retry on timeouts, and retrying a non-idempotent POST can charge a card twice. Well-designed APIs accept an <strong>idempotency key</strong> header so the server can deduplicate retries.</p>
<h3>Status codes</h3>
<table>
<thead><tr><th>Class</th><th>Meaning</th><th>Common codes</th></tr></thead>
<tbody>
<tr><td>2xx</td><td>Success</td><td>200 OK, 201 Created, 204 No Content</td></tr>
<tr><td>3xx</td><td>Redirection</td><td>301 Moved Permanently, 302 Found, 304 Not Modified (use your cached copy)</td></tr>
<tr><td>4xx</td><td>Client error: the <em>request</em> is wrong</td><td>400 Bad Request, 401 Unauthorized (not authenticated), 403 Forbidden (authenticated, not allowed; also WAF blocks), 404 Not Found, 429 Too Many Requests (throttled)</td></tr>
<tr><td>5xx</td><td>Server error: the <em>server side</em> failed</td><td>500 Internal Server Error, 502, 503, 504 (below)</td></tr>
</tbody></table>
<div class="callout"><strong>502 vs 503 vs 504 behind a load balancer:</strong>
<ul>
<li><strong>502 Bad Gateway:</strong> the load balancer reached a target but got an invalid or broken response: the connection was reset, the response was malformed, or the TLS handshake to the target failed.</li>
<li><strong>503 Service Unavailable:</strong> there is nothing healthy to send the request to (for example, no registered or healthy targets), or the service is shedding load.</li>
<li><strong>504 Gateway Timeout:</strong> the target did not respond within the timeout (for example, the ALB idle timeout), or a connection to the target could not be established in time (the security group blocks it, or the app is overloaded).</li>
</ul></div>
<h3>Headers an architect must know</h3>
<ul>
  <li><strong>Host:</strong> selects the virtual host. ALB host-based routing (<code>api.example.com</code> vs <code>www.example.com</code>) reads it.</li>
  <li><strong>X-Forwarded-For (XFF):</strong> a proxy that terminates the client connection replaces the source IP with its own. The ALB appends the original client IP to XFF so the application can still log and rate-limit by client.</li>
  <li><strong>X-Forwarded-Proto / X-Forwarded-Port:</strong> tell the backend whether the client used HTTPS, so it can build correct redirect URLs after TLS offload.</li>
  <li><strong>Cache-Control / ETag:</strong> control caching by browsers and CDNs such as CloudFront.</li>
  <li><strong>Cookies and sticky sessions:</strong> HTTP is stateless. Cookies carry state. A load balancer can pin a client to one target with a cookie (ALB stickiness). This is a workaround; the better design is stateless servers with sessions in ElastiCache or DynamoDB.</li>
</ul>
<h3>HTTP versions</h3>
<table>
<thead><tr><th></th><th>HTTP/1.1</th><th>HTTP/2</th><th>HTTP/3</th></tr></thead>
<tbody>
<tr><td>Transport</td><td>TCP</td><td>TCP (TLS in practice)</td><td><strong>QUIC over UDP</strong> (TLS 1.3 built in)</td></tr>
<tr><td>Format</td><td>Text</td><td>Binary frames</td><td>Binary frames</td></tr>
<tr><td>Concurrency</td><td>One request at a time per connection; browsers open about 6 connections</td><td><strong>Multiplexes</strong> many streams on one connection</td><td>Multiplexed streams that are independent of each other</td></tr>
<tr><td>Headers</td><td>Repeated as plain text</td><td>Compressed (HPACK)</td><td>Compressed (QPACK)</td></tr>
<tr><td>Head-of-line blocking</td><td>At the HTTP level</td><td>Fixed at HTTP level, but one lost <em>TCP</em> packet stalls all streams</td><td>Removed: loss affects only its own stream</td></tr>
<tr><td>Connection set-up</td><td>TCP + TLS (2–3 RTT)</td><td>TCP + TLS (2–3 RTT)</td><td>1 RTT, or 0-RTT on resumption; survives network changes (Wi-Fi → 4G)</td></tr>
</tbody></table>
<h3>WebSockets and gRPC</h3>
<ul>
  <li><strong>WebSocket:</strong> starts as an HTTP/1.1 request with <code>Connection: Upgrade</code> and <code>Upgrade: websocket</code>. The server replies <code>101 Switching Protocols</code>, and the same TCP connection becomes a <strong>full-duplex, long-lived</strong> channel. The server can push messages at any time: chat, live dashboards, multiplayer games, trading tickers.</li>
  <li><strong>gRPC:</strong> a remote-procedure-call framework that runs over <strong>HTTP/2</strong> and uses <strong>Protocol Buffers</strong> (a compact binary schema). It supports unary calls and client-side, server-side and bidirectional streaming. It is ideal for internal service-to-service calls with strict contracts and low latency.</li>
</ul>
<table>
<thead><tr><th>Need</th><th>REST (JSON over HTTP)</th><th>WebSocket</th><th>gRPC</th></tr></thead>
<tbody>
<tr><td>Public API, browsers, caching</td><td><strong>Best</strong></td><td>Possible</td><td>Needs gRPC-Web or a proxy for browsers</td></tr>
<tr><td>Server push / real-time</td><td>Polling (wasteful)</td><td><strong>Best</strong></td><td>Server streaming</td></tr>
<tr><td>Internal microservice calls, strict schema</td><td>OK</td><td>Unusual</td><td><strong>Best</strong> (binary, typed, HTTP/2)</td></tr>
<tr><td>AWS front door</td><td>ALB, API Gateway REST/HTTP APIs, CloudFront</td><td>ALB (native), API Gateway WebSocket APIs</td><td>ALB (gRPC protocol version), NLB (TCP passthrough)</td></tr>
</tbody></table>` },

    { type: "concept", title: "TLS: encryption in transit", html: `
<p><strong>TLS (Transport Layer Security)</strong>, the successor of SSL, sits between TCP and HTTP. HTTPS is simply HTTP inside TLS. TLS provides three guarantees:</p>
<ol>
  <li><strong>Confidentiality:</strong> eavesdroppers see only ciphertext (symmetric encryption such as AES-GCM or ChaCha20).</li>
  <li><strong>Integrity:</strong> tampering is detected (authenticated encryption / MAC).</li>
  <li><strong>Authentication:</strong> the client proves it is talking to the real server, using the server's <strong>certificate</strong>. With <strong>mutual TLS (mTLS)</strong>, the server also verifies a client certificate.</li>
</ol>
<h3>Certificates and the chain of trust</h3>
<ul>
  <li>A <strong>certificate</strong> binds a public key to names (the Subject Alternative Names, e.g. <code>example.com</code>, <code>*.example.com</code>). It has a validity period and is signed by a <strong>Certificate Authority (CA)</strong>.</li>
  <li>The chain is <strong>leaf certificate → intermediate CA → root CA</strong>. Browsers and operating systems ship a trust store of root CAs. The server sends the leaf and intermediates; the client builds the path up to a trusted root.</li>
  <li>A missing intermediate is a classic outage cause: the site works in one browser (which cached the intermediate) and fails in <code>curl</code> or a mobile app.</li>
  <li>A <strong>private CA</strong> issues certificates trusted only by your own systems (internal services, mTLS clients). On AWS that is <strong>AWS Private CA</strong>.</li>
</ul>
<h3>SNI: many certificates on one IP</h3>
<p><strong>Server Name Indication (SNI)</strong> is a field in the ClientHello that says which hostname the client wants. The server picks the matching certificate <em>before</em> any HTTP is exchanged, because the Host header is encrypted. SNI lets one ALB, NLB TLS listener or CloudFront distribution serve many domains with different certificates.</p>
<h3>Cipher suites and versions</h3>
<p>Use TLS 1.2 or TLS 1.3 only. SSL 3.0, TLS 1.0 and TLS 1.1 are deprecated. Prefer suites with <strong>forward secrecy</strong> (ephemeral ECDHE key exchange), so that a stolen server private key cannot decrypt traffic recorded in the past. TLS 1.3 removed all suites that lack forward secrecy.</p>` + DG_0205_TERM },

    { type: "workflow", title: "Step by step: what happens when you open https://shop.example.com", html: `
<ol class="flow">
  <li><strong>DNS:</strong> the browser resolves <code>shop.example.com</code> to an IP address (UDP 53, see M02.04). For an ALB this returns several IPs, one per enabled AZ.</li>
  <li><strong>TCP handshake (1 RTT):</strong> the browser picks an ephemeral port such as 51514 and sends <code>SYN</code> to port 443. The server replies <code>SYN-ACK</code> and the browser sends <code>ACK</code>. Both sides now hold state for the 5-tuple.</li>
  <li><strong>ClientHello:</strong> the browser sends the TLS versions and cipher suites it supports, a random value, <strong>SNI = shop.example.com</strong>, ALPN (it would like <code>h2</code>), and in TLS 1.3 a key share (its ECDHE public value).</li>
  <li><strong>ServerHello and certificate:</strong> the server picks TLS 1.3 and a cipher and sends its own key share. Both sides can now derive the handshake keys, so the server's <em>Certificate</em>, <em>CertificateVerify</em> (a signature proving it owns the private key) and <em>Finished</em> are already encrypted.</li>
  <li><strong>Client verification:</strong> the browser checks that the certificate chain leads to a trusted root, the name matches the SAN list, the dates are valid and the certificate is not revoked. It then sends <em>Finished</em>.</li>
  <li><strong>Application data (TLS 1.3: after 1 RTT):</strong> the first HTTP/2 request goes out encrypted with the session keys. In <strong>TLS 1.2</strong> this step comes one round trip later. Its handshake is ClientHello → ServerHello, Certificate, ServerKeyExchange, ServerHelloDone → ClientKeyExchange, ChangeCipherSpec, Finished → ChangeCipherSpec, Finished: <strong>2 RTT</strong>.</li>
  <li><strong>Load balancer processing:</strong> if an ALB terminates TLS, it decrypts the request, evaluates listener rules (host, path, headers), adds <code>X-Forwarded-For</code> and <code>X-Forwarded-Proto</code>, and opens or reuses a connection to a healthy target.</li>
  <li><strong>Response and reuse:</strong> the response returns over the same connection. HTTP keep-alive and HTTP/2 multiplexing reuse it for the next requests, so the handshakes are not repeated. TLS session resumption (session tickets) makes later connections cheaper.</li>
  <li><strong>Close:</strong> after the idle timeout (or when the browser closes the tab) one side sends a TLS <em>close_notify</em> and a TCP <code>FIN</code>. If a middlebox forgot the flow, the next packet gets a <code>RST</code> instead.</li>
</ol>
<div class="callout tip"><strong>Latency maths:</strong> with a 100 ms RTT, a brand-new HTTPS request costs about 1 RTT (TCP) + 1 RTT (TLS 1.3) + 1 RTT (request/response) = <strong>~300 ms</strong> before the first byte arrives, before any server processing. TLS 1.2 adds another 100 ms. This is why CloudFront (which terminates TLS at an edge location a few ms away) and connection reuse make sites feel faster.</div>` },

    { type: "aws", html: `
<h3>Load balancers by protocol</h3>
<table>
<thead><tr><th></th><th>Application Load Balancer (ALB)</th><th>Network Load Balancer (NLB)</th></tr></thead>
<tbody>
<tr><td>OSI layer</td><td>7 (HTTP)</td><td>4 (TCP / UDP / TLS)</td></tr>
<tr><td>Listener protocols</td><td>HTTP, HTTPS (HTTP/1.1, HTTP/2, gRPC, WebSocket)</td><td>TCP, UDP, TCP_UDP, TLS</td></tr>
<tr><td>Routing</td><td>Host, path, headers, query string, method, source IP</td><td>Port only (one listener → one target group)</td></tr>
<tr><td>TLS</td><td>Terminates (optionally re-encrypts to the targets); mTLS support</td><td>TLS listener terminates, <strong>or</strong> a TCP listener passes TLS through</td></tr>
<tr><td>Client IP at the target</td><td>In the <code>X-Forwarded-For</code> header</td><td>Preserved as the source IP (for instance and IP targets, with caveats), or via <strong>Proxy Protocol v2</strong></td></tr>
<tr><td>Static IP</td><td>No (DNS name only; put Global Accelerator or an NLB in front for static IPs)</td><td><strong>Yes</strong>: one per AZ, optionally your Elastic IPs</td></tr>
<tr><td>Idle timeout</td><td>Default <strong>60 s</strong>, configurable (1–4000 s)</td><td>TCP idle timeout <strong>350 s</strong> (configurable); UDP flows time out sooner</td></tr>
<tr><td>Extra features</td><td>AWS WAF, OIDC/Cognito authentication, Lambda targets, redirects, fixed responses</td><td>Extreme throughput, very low latency, PrivateLink endpoint services</td></tr>
</tbody></table>
<h3>AWS Certificate Manager (ACM)</h3>
<ul>
  <li>Issues <strong>public TLS certificates at no extra cost</strong> and <strong>renews them automatically</strong> (DNS validation is the easiest: a CNAME record in Route 53 that ACM can keep checking).</li>
  <li>ACM is <strong>Regional</strong>: a certificate can be attached only to resources in the same Region. <strong>CloudFront only uses ACM certificates from <code>us-east-1</code></strong> (N. Virginia), whichever Region your origin is in.</li>
  <li>Public ACM certificates are used through <strong>integrated services</strong> (ELB, CloudFront, API Gateway, App Runner and others). You don't get the private key, so you can't install them on an EC2 web server. For TLS on EC2 itself, use a certificate from another CA (e.g. Let's Encrypt), an <strong>exportable</strong> certificate where ACM offers that option, or a certificate from <strong>AWS Private CA</strong> for internal traffic.</li>
  <li>Imported third-party certificates are allowed, but ACM does <em>not</em> renew them. It emits expiry events you should alarm on.</li>
</ul>
<h3>Security policies and HTTP versions</h3>
<ul>
  <li>An ALB/NLB TLS listener has a <strong>security policy</strong> that lists allowed TLS versions and ciphers. Choose a policy that allows only TLS 1.2+ (or TLS 1.3 only) for compliance, and an FIPS policy where required.</li>
  <li>Redirect HTTP to HTTPS with an ALB listener rule on port 80 (a 301 redirect), or with the CloudFront viewer protocol policy <em>Redirect HTTP to HTTPS</em>.</li>
  <li>CloudFront supports HTTP/2 and HTTP/3 (QUIC) to viewers, and TLS 1.3. Turning these on improves performance for mobile and lossy networks without changing your origin.</li>
  <li><strong>Encryption in transit inside AWS:</strong> traffic between Nitro-based instances in supported types is encrypted at the hardware level automatically. Compliance often still requires TLS end to end (re-encrypt at the ALB, or passthrough).</li>
</ul>
<h3>Security groups are written in Layer 4 terms</h3>
<pre><code># allow HTTPS from the ALB's security group to the app instances
Type: Custom TCP   Protocol: TCP   Port: 443   Source: sg-0alb1234 (ALB security group)
# allow DNS from the VPC to a Resolver inbound endpoint
Type: DNS (UDP)    Protocol: UDP   Port: 53    Source: 10.0.0.0/16
Type: DNS (TCP)    Protocol: TCP   Port: 53    Source: 10.0.0.0/16</code></pre>
<p>Next modules: <strong>M12</strong> (DNS, edge and load balancing: ELB and CloudFront in depth), <strong>M07</strong> (encryption, ACM and Private CA).</p>` },

    { type: "examples", title: "Worked examples: reading the wire", html: `
<h3>1. <code>curl -v</code>: every layer in one command</h3>
<pre><code>$ curl -v https://example.com/
*   Trying 93.184.215.14:443...                      ← DNS result; TCP SYN to port 443
* Connected to example.com (93.184.215.14) port 443   ← 3-way handshake complete
* ALPN: curl offers h2,http/1.1                        ← asks for HTTP/2 via ALPN
* TLSv1.3 (OUT), TLS handshake, Client hello (1):      ← ClientHello (contains SNI=example.com)
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):
* TLSv1.3 (IN), TLS handshake, Certificate (11):      ← server certificate chain
* TLSv1.3 (IN), TLS handshake, CERT verify (15):     ← proof of the private key
* TLSv1.3 (IN), TLS handshake, Finished (20):
* TLSv1.3 (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384  ← negotiated version + cipher
* ALPN: server accepted h2                            ← HTTP/2 will be used
* Server certificate:
*  subject: CN=www.example.org
*  subjectAltName: host "example.com" matched cert's "example.com"  ← name check passed
*  issuer: C=US; O=DigiCert Inc; CN=DigiCert Global G2 TLS RSA SHA256 2020 CA1  ← intermediate
*  SSL certificate verify ok.                          ← chain reached a trusted root
&gt; GET / HTTP/2                                         ← request (sent encrypted)
&gt; Host: example.com
&gt; User-Agent: curl/8.5.0
&lt; HTTP/2 200                                          ← status
&lt; content-type: text/html; charset=UTF-8
&lt; cache-control: max-age=604800                       ← cacheable for 7 days</code></pre>
<p>When something fails, the output shows <em>where</em>: stuck at <code>Trying…</code> means a network or security group problem (no SYN-ACK). <code>Connection refused</code> means the host answered with RST, so nothing is listening on that port. <code>SSL certificate problem: unable to get local issuer certificate</code> means a broken chain. An HTTP 502/504 means TLS worked and the problem is behind the load balancer.</p>
<p>Add timing with: <code>curl -s -o /dev/null -w "dns=%{time_namelookup} tcp=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}\\n" https://example.com</code>.</p>
<h3>2. <code>openssl s_client</code>: inspect the certificate chain</h3>
<pre><code>$ openssl s_client -connect example.com:443 -servername example.com &lt;/dev/null 2&gt;/dev/null | head -20
CONNECTED(00000003)
---
Certificate chain
 0 s:CN = www.example.org                                  ← leaf (subject)
   i:C = US, O = DigiCert Inc, CN = DigiCert Global G2 TLS RSA SHA256 2020 CA1  ← issued by…
 1 s:C = US, O = DigiCert Inc, CN = DigiCert Global G2 TLS RSA SHA256 2020 CA1  ← intermediate
   i:C = US, O = DigiCert Inc, OU = www.digicert.com, CN = DigiCert Global Root G2  ← root (in trust store)
---
...
New, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
Verify return code: 0 (ok)                                ← 0 = chain valid

# Expiry dates only:
$ openssl s_client -connect example.com:443 -servername example.com &lt;/dev/null 2&gt;/dev/null \\
    | openssl x509 -noout -dates -subject
notBefore=Jan 15 00:00:00 2026 GMT
notAfter=Jan 15 23:59:59 2027 GMT</code></pre>
<p>Omit <code>-servername</code> against a multi-domain endpoint and you may get the <em>default</em> certificate. That is how you diagnose an SNI problem.</p>
<h3>3. <code>tcpdump</code>: the handshake on the wire</h3>
<pre><code>$ sudo tcpdump -ni eth0 'tcp port 443 and host 93.184.215.14' -c 6
10:01:02.100 IP 10.0.1.25.51514 &gt; 93.184.215.14.443: Flags [S],  seq 1000          ← SYN
10:01:02.190 IP 93.184.215.14.443 &gt; 10.0.1.25.51514: Flags [S.], seq 7000, ack 1001 ← SYN-ACK (90 ms RTT)
10:01:02.190 IP 10.0.1.25.51514 &gt; 93.184.215.14.443: Flags [.],  ack 7001          ← ACK
10:01:02.191 IP 10.0.1.25.51514 &gt; 93.184.215.14.443: Flags [P.], length 517        ← ClientHello
10:01:02.282 IP 93.184.215.14.443 &gt; 10.0.1.25.51514: Flags [P.], length 2870       ← ServerHello…Finished
10:01:02.283 IP 10.0.1.25.51514 &gt; 93.184.215.14.443: Flags [F.]                     ← FIN (graceful close)</code></pre>
<p>Flags: <code>S</code> = SYN, <code>.</code> = ACK, <code>P</code> = push (data), <code>F</code> = FIN, <code>R</code> = RST. A run of <code>[S]</code> packets with no <code>[S.]</code> reply means the SYN is being <strong>dropped</strong> (security group, NACL or route). An immediate <code>[R.]</code> means it is being <strong>refused</strong> (nothing listening, or a firewall that sends resets).</p>
<h3>4. Sizing a timeout chain</h3>
<p>A report endpoint takes up to 90 s. The chain is CloudFront → ALB → app (gunicorn) → RDS.</p>
<table>
<thead><tr><th>Hop</th><th>Default</th><th>Set to</th><th>Rule</th></tr></thead>
<tbody>
<tr><td>CloudFront origin response timeout</td><td>30 s</td><td>Raise as allowed, or make the endpoint asynchronous</td><td>Outer timeouts ≥ inner timeouts</td></tr>
<tr><td>ALB idle timeout</td><td>60 s</td><td>120 s</td><td>Longer than the slowest response</td></tr>
<tr><td>App server keep-alive</td><td>e.g. 2–5 s</td><td><strong>&gt; ALB idle timeout</strong> (e.g. 125 s)</td><td>The backend must not close idle connections before the ALB does, or the ALB reuses a dead connection → 502</td></tr>
<tr><td>Database statement timeout</td><td>none</td><td>100 s</td><td>Inner timeouts fire first so errors are meaningful</td></tr>
</tbody></table>
<p>Better still: return <code>202 Accepted</code> with a job ID, run the report asynchronously (SQS + worker), and let the client poll or receive a notification.</p>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>Choose</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Public website and REST API with path-based routing (<code>/api/*</code>, <code>/img/*</code>)</td><td>ALB with an HTTPS listener and an ACM certificate</td><td>L7 routing, TLS offload, AWS WAF integration</td></tr>
<tr><td>Multiplayer game server using a custom UDP protocol</td><td>NLB with a UDP listener</td><td>The ALB does not support UDP. The NLB adds very low latency and static IPs per AZ.</td></tr>
<tr><td>Partner requires you to whitelist fixed IPs for a TLS API</td><td>NLB with Elastic IPs (TLS listener or TCP passthrough), or Global Accelerator in front of an ALB</td><td>An ALB's IPs change. The NLB and Global Accelerator provide static IPs.</td></tr>
<tr><td>Regulated workload: data must stay encrypted until the application, and the app must verify client identity</td><td>NLB TCP passthrough with mTLS on the targets, or ALB mTLS plus re-encryption</td><td>Passthrough means no intermediate sees plaintext. mTLS authenticates clients by certificate.</td></tr>
<tr><td>Real-time notifications to browsers</td><td>WebSockets on ALB, or API Gateway WebSocket APIs (serverless)</td><td>Full-duplex server push without polling</td></tr>
<tr><td>Internal microservices with high call volume and strict contracts</td><td>gRPC over HTTP/2 (ALB gRPC target groups, or a service mesh / VPC Lattice)</td><td>Binary, multiplexed, typed, supports streaming</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: run it yourself (free)", html: `
<p>Run these in WSL/Linux, macOS or <strong>AWS CloudShell</strong> (install tools with <code>sudo dnf install -y bind-utils tcpdump nc</code> where needed).</p>
<pre><code># 1. Which TLS version and cipher, and how long each phase takes
curl -sv -o /dev/null https://aws.amazon.com 2&gt;&amp;1 | grep -E "Connected|SSL connection|ALPN|subject:|issuer:"
curl -s -o /dev/null -w "dns=%{time_namelookup}s tcp=%{time_connect}s tls=%{time_appconnect}s ttfb=%{time_starttransfer}s\\n" https://aws.amazon.com

# 2. Force HTTP/1.1 vs HTTP/2 and compare headers
curl -sI --http1.1 https://aws.amazon.com | head -1
curl -sI --http2   https://aws.amazon.com | head -1

# 3. Certificate chain and expiry
openssl s_client -connect aws.amazon.com:443 -servername aws.amazon.com -showcerts &lt;/dev/null 2&gt;/dev/null | grep -E " s:| i:"

# 4. Is a TCP port open? (open = succeeded, refused = RST, timeout = silently dropped)
nc -vz -w 3 aws.amazon.com 443
nc -vz -w 3 aws.amazon.com 22

# 5. Watch the handshake (Linux/WSL, needs sudo); run curl in a second terminal
sudo tcpdump -ni any 'tcp port 443 and (tcp[tcpflags] &amp; (tcp-syn|tcp-fin|tcp-rst) != 0)'

# 6. Your Linux ephemeral port range
cat /proc/sys/net/ipv4/ip_local_port_range</code></pre>
<p>Write down: the negotiated TLS version, the cipher, the issuer of the leaf certificate, and the time spent in the TLS phase (tls − tcp). Compare a site far from you with one nearby. The TCP and TLS phases grow with distance (RTT), and the server time does not.</p>` },

    { type: "casestudy", title: "Case study: ChatterBox and the 60-second logout", html: `
<p><strong>Company:</strong> ChatterBox, a fictional SaaS team-chat start-up with 40,000 daily users.</p>
<p><strong>Starting point:</strong> a Node.js app on EC2 in an Auto Scaling group behind an ALB (HTTPS listener with an ACM certificate). The chat UI used <strong>long-polling</strong>: each browser sent a request that the server held open until a message arrived. Users complained of being "kicked out" during quiet periods, and the ALB metrics showed spikes of <code>HTTPCode_ELB_504_Count</code> and <code>HTTPCode_ELB_502_Count</code>.</p>
<h3>Diagnosis</h3>
<ol>
  <li>The long-poll requests were held for up to 90 s, but the ALB <strong>idle timeout was the default 60 s</strong>. The ALB gave up and returned <strong>504</strong>.</li>
  <li>The Node.js server's keep-alive timeout was <strong>5 s</strong>, shorter than the ALB's 60 s. Sometimes the ALB reused a connection the backend had just closed and got a reset, which produced <strong>502</strong>.</li>
  <li>Each long-poll cycle repeated a full HTTP request with cookies and headers, about 2 KB per poll per user, even when nothing happened.</li>
</ol>
<h3>Decision</h3>
<table>
<thead><tr><th>Change</th><th>Reason</th></tr></thead>
<tbody>
<tr><td>Move the chat channel to <strong>WebSockets</strong>, still on the ALB (native support, no new service)</td><td>Full-duplex push. One upgrade, then small frames.</td></tr>
<tr><td>Client sends an application-level <strong>ping every 30 s</strong></td><td>Keeps the connection inside the ALB idle timeout</td></tr>
<tr><td>Raise the ALB idle timeout to 120 s; set the Node.js <code>keepAliveTimeout</code> to 125 s</td><td>The backend keep-alive must exceed the LB idle timeout</td></tr>
<tr><td>Store presence/session state in ElastiCache; disable ALB stickiness</td><td>Any instance can serve a reconnecting client, so scale-in doesn't drop sessions permanently</td></tr>
<tr><td>Clients reconnect with exponential backoff and jitter</td><td>Deployments and scale-in close connections. Reconnects must not stampede.</td></tr>
</tbody></table>
<h3>Result</h3>
<p>Over the next month the 5xx rate fell from about 1.8% to under 0.05%. Message delivery latency fell from about 400 ms to about 40 ms, and request counts (and the ALB LCU charges driven by new connections and requests) dropped sharply.</p>
<h3>Lessons learned</h3>
<ul>
  <li>When the symptom is "every N seconds", look for a timeout of N seconds.</li>
  <li>Timeouts must be designed as a chain, not set one at a time.</li>
  <li>Long-lived connections change how you scale: connection count, not request rate, becomes the scaling metric, and deployments must drain connections gracefully (deregistration delay).</li>
</ul>` },

    { type: "exam", html: `
<div class="keyword-list"><span>UDP / gaming / VoIP / IoT → NLB</span><span>static IP / whitelist IPs → NLB or Global Accelerator</span><span>path- or host-based routing → ALB</span><span>WebSocket / gRPC / HTTP/2 → ALB</span><span>end-to-end encryption, LB must not decrypt → NLB TCP passthrough</span><span>client IP at the app behind ALB → X-Forwarded-For</span><span>certificate for CloudFront → ACM in us-east-1</span><span>free auto-renewing certificate → ACM</span><span>offload TLS from EC2 → terminate at the load balancer</span></div>
<table>
<thead><tr><th>Confusable pair</th><th>How to tell them apart</th></tr></thead>
<tbody>
<tr><td>TCP vs UDP</td><td>Reliable and ordered vs fast and loss-tolerant. UDP is the hint to choose an NLB.</td></tr>
<tr><td>ALB vs NLB</td><td>HTTP-aware features (paths, headers, WAF, auth) → ALB. Raw L4, UDP, static IPs, millions of requests/s, PrivateLink → NLB.</td></tr>
<tr><td>TLS termination vs passthrough</td><td>Termination enables inspection and L7 routing and offloads CPU. Passthrough keeps plaintext away from the LB (compliance, mTLS on the app).</td></tr>
<tr><td>401 vs 403</td><td>401: who are you? (not authenticated). 403: I know who you are, and the answer is no (also returned by AWS WAF blocks and S3 permission errors).</td></tr>
<tr><td>502 vs 504</td><td>502: the target sent a bad or broken response. 504: the target didn't answer in time.</td></tr>
<tr><td>ACM public cert vs Private CA</td><td>Public: internet-facing endpoints on integrated services. Private CA: internal services, mTLS client certificates, and certificates you need to install yourself.</td></tr>
</tbody></table>
<p><strong>Common distractors:</strong> "Use an ALB with a UDP listener" (it doesn't exist). "Install the ACM public certificate on the EC2 instances" (you can't export it for that). "Request the CloudFront certificate in the origin's Region" (it must be in us-east-1). "Assign an Elastic IP to the ALB" (not supported).</p>` },

    { type: "architect", html: `
<ul>
  <li><strong>Timeout chain:</strong> outer layers must wait longer than inner layers, and backend keep-alive must exceed the LB idle timeout. Mismatches cause intermittent 502/504 errors that look random.</li>
  <li><strong>Connection reuse is a performance feature.</strong> Database connections from Lambda are a classic problem: thousands of short-lived functions open thousands of TLS connections. Use RDS Proxy (connection pooling) and HTTP keep-alive in SDK clients.</li>
  <li><strong>Certificate expiry is still a top cause of outages.</strong> Prefer ACM-managed certificates (auto-renewed, with DNS validation records left in place). Alarm on the <code>DaysToExpiry</code> metric and ACM expiry events for imported certificates.</li>
  <li><strong>Log the real client IP:</strong> behind an ALB use <code>X-Forwarded-For</code> (and trust only the entry your own LB appended). Behind an NLB with instance targets the source IP is preserved, so security groups must allow <em>client</em> IPs, not just the NLB's. Enable ALB/NLB access logs for forensics.</li>
  <li><strong>Troubleshooting playbook:</strong> DNS (<code>dig</code>) → TCP reachability (<code>nc -vz</code>; timeout = dropped, refused = RST) → TLS (<code>openssl s_client</code>) → HTTP (<code>curl -v</code>) → LB metrics and access logs (ELB 5xx vs target 5xx) → application logs. Work up the stack one layer at a time.</li>
  <li><strong>Cost:</strong> ALB and NLB charges include capacity units driven by new connections, active connections, processed bytes and (ALB) rule evaluations. Long-polling and short-lived connections cost more than WebSockets or keep-alive. TLS termination on the LB removes CPU work from your instances, which can allow smaller instance types.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>A flow is a 5-tuple: protocol, source IP, source port, destination IP, destination port. Clients use ephemeral ports (allow 1024–65535 for return traffic in NACLs).</li>
  <li>TCP is reliable and ordered (handshake, ACKs, retransmission, flow and congestion control). UDP is connectionless and suits DNS, VoIP, gaming and QUIC.</li>
  <li>HTTP is stateless request/response. Know the methods, idempotency, 4xx vs 5xx, and 502/503/504 behind a load balancer.</li>
  <li>HTTP/2 multiplexes over one TCP connection. HTTP/3 runs over QUIC (UDP) and removes TCP head-of-line blocking.</li>
  <li>WebSockets are an HTTP upgrade to a full-duplex channel. gRPC is RPC over HTTP/2 with protobuf.</li>
  <li>TLS gives confidentiality, integrity and authentication. TLS 1.3 takes 1 RTT to handshake and TLS 1.2 takes 2. SNI selects the certificate. mTLS authenticates the client too.</li>
  <li>Termination options: offload at the ALB, re-encrypt to targets, or pass through on an NLB TCP listener.</li>
  <li>ACM public certificates are free, auto-renewing, Regional, and usable only on integrated services. CloudFront needs them in us-east-1.</li>
  <li>The ALB idle timeout defaults to 60 s. Keep backend keep-alive longer than it.</li>
</ul>` }
  ],
  drills: [
    { id: "M02.05-d1", q: "A security group must allow an application to reach an Aurora PostgreSQL cluster. Which TCP port?", answers: ["5432"], hint: "Same as any PostgreSQL database.", explain: "PostgreSQL and Aurora PostgreSQL listen on TCP 5432 by default. MySQL/Aurora MySQL use 3306." },
    { id: "M02.05-d2", q: "Which port and protocol must be allowed for Amazon EFS mount targets? (format: <code>TCP 1234</code>)", answers: ["TCP 2049", "tcp2049", "2049/tcp", "2049"], hint: "EFS uses NFS v4.", explain: "NFS uses TCP 2049. Allow it from the clients' security group on the mount target's security group." },
    { id: "M02.05-d3", q: "An ALB returns an error because no healthy targets are registered in the target group. Which HTTP status code does the client most likely see?", answers: ["503"], hint: "Nothing available to serve the request.", explain: "503 Service Unavailable. 502 means a target gave a bad response; 504 means a target didn't answer in time." },
    { id: "M02.05-d4", q: "With an RTT of 80 ms, how many milliseconds pass before the first response byte for a brand-new HTTPS request using TLS 1.3 (ignore server processing time)?", answers: ["240", "240ms", "240 ms"], hint: "TCP handshake + TLS 1.3 handshake + the request/response itself: count the round trips.", explain: "1 RTT (TCP) + 1 RTT (TLS 1.3) + 1 RTT (HTTP request/response) = 3 × 80 = 240 ms. With TLS 1.2 it would be 4 × 80 = 320 ms." },
    { id: "M02.05-d5", q: "Which UDP port does IPsec NAT traversal (NAT-T) use?", answers: ["4500", "udp 4500", "udp4500"], hint: "IKE itself uses 500.", explain: "IKE uses UDP 500. When a NAT device is detected, IKE and ESP are encapsulated in UDP 4500." },
    { id: "M02.05-d6", q: "In <code>tcpdump</code> output, which flag letter marks a connection reset?", answers: ["R", "[R]", "R."], hint: "S = SYN, F = FIN, P = push…", explain: "<code>R</code> = RST. An immediate RST after a SYN means the port is closed or a firewall rejected it." }
  ],
  check: [
    { id: "M02.05-k1", type: "single", domain: "D3", task: "3.4", level: 200,
      stem: "A company runs a real-time multiplayer game that uses a custom protocol over <strong>UDP</strong>. Players connect from around the world and the operator needs a load balancer in front of the EC2 game servers. Which option meets the requirement?",
      options: [
        { t: "A Network Load Balancer with a UDP listener", c: true, why: "The NLB is the only Elastic Load Balancing type that supports UDP listeners, and it adds very low latency." },
        { t: "An Application Load Balancer with an HTTP listener", c: false, why: "The ALB handles HTTP/HTTPS (Layer 7) only. It cannot forward raw UDP datagrams." },
        { t: "An Application Load Balancer with sticky sessions", c: false, why: "Stickiness doesn't add UDP support. The ALB still only speaks HTTP/HTTPS." },
        { t: "Amazon CloudFront with the EC2 instances as a custom origin", c: false, why: "CloudFront fetches content from origins over HTTP/HTTPS. It does not proxy custom UDP protocols." }
      ] },
    { id: "M02.05-k2", type: "single", domain: "D1", task: "1.3", level: 200,
      stem: "A healthcare API must keep traffic encrypted <strong>all the way to the application</strong>, and the security team does not allow any intermediate device to decrypt it. The application authenticates clients with mutual TLS. Which design meets this requirement with the LEAST change to the application?",
      options: [
        { t: "A Network Load Balancer with a TCP listener on port 443 forwarding to the instances, which hold their own certificates", c: true, why: "TCP passthrough means the NLB never decrypts. TLS and mTLS terminate on the application, which already does mTLS." },
        { t: "An Application Load Balancer with an HTTPS listener and HTTP targets", c: false, why: "The ALB decrypts and forwards plain text, which violates the no-decryption rule." },
        { t: "An Application Load Balancer that re-encrypts to HTTPS targets", c: false, why: "Traffic is encrypted on both legs, but the ALB decrypts in between, which the security team forbids." },
        { t: "CloudFront with an ACM certificate in us-east-1 in front of the instances", c: false, why: "CloudFront terminates TLS at the edge, so it decrypts traffic." }
      ] },
    { id: "M02.05-k3", type: "single", domain: "D2", task: "2.2", level: 200,
      stem: "Users of a report page behind an Application Load Balancer get HTTP <strong>504</strong> errors for reports that take about 75 seconds to generate. Shorter reports work. What is the MOST likely cause?",
      options: [
        { t: "The ALB idle timeout is still at its default of 60 seconds", c: true, why: "The ALB closes the connection and returns 504 when the target sends nothing within the idle timeout (default 60 s)." },
        { t: "The target group has no healthy targets", c: false, why: "That would produce 503 for every request, not only the long ones." },
        { t: "The ACM certificate has expired", c: false, why: "An expired certificate breaks the TLS handshake for every request before any HTTP status is returned." },
        { t: "The security group blocks ephemeral ports", c: false, why: "Security groups are stateful, so return traffic is allowed automatically. And short requests work, so connectivity is fine." }
      ] },
    { id: "M02.05-k4", type: "single", domain: "D1", task: "1.3", level: 200,
      stem: "A team is adding a custom domain with HTTPS to an Amazon CloudFront distribution. The origin is an ALB in <code>eu-west-1</code>. Where must the CloudFront viewer certificate be requested in AWS Certificate Manager?",
      options: [
        { t: "us-east-1 (N. Virginia)", c: true, why: "CloudFront is global and only uses ACM certificates from us-east-1." },
        { t: "eu-west-1, the Region of the origin", c: false, why: "That certificate can be attached to the ALB, but CloudFront won't list it for the distribution." },
        { t: "Any Region, because ACM certificates are global", c: false, why: "ACM certificates are Regional resources." },
        { t: "Every Region where viewers are located", c: false, why: "One certificate in us-east-1 covers all CloudFront edge locations." }
      ] },
    { id: "M02.05-k5", type: "multi", domain: "D3", task: "3.4", level: 200,
      stem: "Which TWO requirements point to an <strong>Application Load Balancer</strong> rather than a Network Load Balancer?",
      options: [
        { t: "Route <code>/api/*</code> and <code>/images/*</code> to different target groups", c: true, why: "Path-based routing needs Layer 7 visibility into HTTP." },
        { t: "Attach AWS WAF rules to block SQL injection", c: true, why: "AWS WAF integrates with the ALB (and CloudFront, API Gateway and others) because it inspects HTTP requests." },
        { t: "Provide one static IP address per AZ for a partner's firewall allow-list", c: false, why: "That points to an NLB (or Global Accelerator). ALB IPs are not static." },
        { t: "Load balance a UDP-based syslog stream", c: false, why: "UDP needs an NLB." },
        { t: "Pass TLS through to the instances without decrypting", c: false, why: "Passthrough is a TCP-listener feature of the NLB." }
      ] },
    { id: "M02.05-k6", type: "single", domain: "D2", task: "2.1", level: 200,
      stem: "An application behind an ALB logs every request as coming from private IPs in the VPC, so per-client rate limiting doesn't work. How should the developers get the original client IP?",
      options: [
        { t: "Read the <code>X-Forwarded-For</code> request header", c: true, why: "The ALB terminates the client connection and appends the client's IP to X-Forwarded-For." },
        { t: "Enable Proxy Protocol v2 on the ALB", c: false, why: "Proxy Protocol v2 is an NLB target group option. The ALB uses X-Forwarded-For." },
        { t: "Assign Elastic IPs to the targets", c: false, why: "The source IP seen by the targets is still the ALB's address." },
        { t: "Read the <code>Host</code> header", c: false, why: "Host contains the requested domain name, not the client IP." }
      ] }
  ],
  cards: ["fc-M02-5-01", "fc-M02-5-02", "fc-M02-5-03", "fc-M02-5-04", "fc-M02-5-05", "fc-M02-5-06", "fc-M02-5-07", "fc-M02-5-08", "fc-M02-5-09", "fc-M02-5-10", "fc-M02-5-11", "fc-M02-5-12"],
  references: [
    "<em>System Design on AWS</em> ch.6 \"Communication Networks &amp; Protocols\": TCP/UDP, HTTP, TLS (PDF p247–299)",
    "Elastic Load Balancing User Guide: <em>Application Load Balancers</em> (listeners, idle timeout, X-Forwarded headers) and <em>Network Load Balancers</em> (listeners, Proxy Protocol, client IP preservation)",
    "AWS Certificate Manager User Guide: <em>Supported Regions</em> and <em>Services integrated with ACM</em>",
    "RFC 9293 (TCP), RFC 8446 (TLS 1.3), RFC 9110 (HTTP semantics), RFC 9114 (HTTP/3), RFC 6455 (WebSocket)",
    "IANA Service Name and Transport Protocol Port Number Registry"
  ]
});

FLASHCARDS.push(
  { id: "fc-M02-5-01", front: "What are the five values of a 5-tuple?", back: "Protocol, source IP, source port, destination IP, destination port." },
  { id: "fc-M02-5-02", front: "Ephemeral port range to allow for return traffic in a NACL?", back: "1024–65535 (covers Linux 32768–60999, Windows 49152–65535, ELB and NAT gateway)." },
  { id: "fc-M02-5-03", front: "Default ports: MySQL, PostgreSQL, SQL Server, Oracle, Redis, NFS?", back: "3306, 5432, 1433, 1521, 6379, 2049." },
  { id: "fc-M02-5-04", front: "TCP vs UDP in one line each?", back: "TCP: connection-oriented, reliable, ordered, congestion-controlled. UDP: connectionless datagrams, no guarantees, lowest latency (DNS, VoIP, gaming, QUIC)." },
  { id: "fc-M02-5-05", front: "Behind a load balancer: 502 vs 503 vs 504?", back: "502: target gave an invalid response or reset. 503: no healthy targets / unavailable. 504: target didn't respond in time (idle timeout)." },
  { id: "fc-M02-5-06", front: "ALB default idle timeout and the backend rule?", back: "60 s. The backend keep-alive timeout must be longer than the ALB idle timeout, or you get intermittent 502s." },
  { id: "fc-M02-5-07", front: "HTTP/1.1 vs HTTP/2 vs HTTP/3?", back: "1.1: text, one request at a time per connection. 2: binary, multiplexed streams over one TCP connection, HPACK. 3: QUIC over UDP, no TCP head-of-line blocking, faster set-up." },
  { id: "fc-M02-5-08", front: "WebSocket vs gRPC?", back: "WebSocket: HTTP Upgrade → full-duplex long-lived channel (server push). gRPC: RPC over HTTP/2 with protobuf, streaming, for service-to-service calls." },
  { id: "fc-M02-5-09", front: "TLS 1.2 vs TLS 1.3 handshake round trips?", back: "TLS 1.2: 2 RTT. TLS 1.3: 1 RTT (0-RTT resumption possible). TLS 1.3 also mandates forward secrecy." },
  { id: "fc-M02-5-10", front: "What does SNI do?", back: "Server Name Indication: the client names the host in the ClientHello so the server can pick the right certificate. Many TLS domains can share one IP/LB." },
  { id: "fc-M02-5-11", front: "Three TLS termination options on AWS?", back: "Offload at ALB (HTTP to targets) · terminate and re-encrypt at ALB (HTTPS to targets) · passthrough via NLB TCP listener (targets terminate)." },
  { id: "fc-M02-5-12", front: "ACM rules to remember?", back: "Public certificates are free and auto-renew. They are Regional and used only through integrated services (ELB, CloudFront, API Gateway…), not installed on EC2. CloudFront needs the cert in us-east-1." }
);

  // ================================================================== 06_security.js
/* M02.06 – VPNs, firewalls and proxies */
var DG_0206_STATE = `
<figure>
<svg class="diagram" viewBox="0 0 760 360" role="img" aria-labelledby="dg0206at dg0206ad">
  <title id="dg0206at">Stateful versus stateless filtering of return traffic</title>
  <desc id="dg0206ad">Top: a stateful firewall such as a security group records the outbound request from a client and automatically allows the reply. Bottom: a stateless filter such as a network ACL evaluates the reply as a new packet, so an explicit rule must allow the ephemeral destination port range 1024 to 65535 or the reply is dropped.</desc>
  <defs><marker id="dg0206a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <text class="dg-tb" x="12" y="22">Stateful (security group): replies are remembered and allowed</text>
  <rect class="dg-box" x="12" y="40" width="150" height="62" rx="6"/><text class="dg-t" x="26" y="62">Client</text><text class="dg-ts" x="26" y="80">198.51.100.9</text><text class="dg-ts" x="26" y="94">port 50122</text>
  <rect class="dg-good" x="300" y="40" width="160" height="62" rx="6"/><text class="dg-t" x="314" y="62">Security group</text><text class="dg-ts" x="314" y="80">inbound: TCP 443 allow</text><text class="dg-ts" x="314" y="94">state table: flow saved</text>
  <rect class="dg-box" x="598" y="40" width="150" height="62" rx="6"/><text class="dg-t" x="612" y="62">Web server</text><text class="dg-ts" x="612" y="80">10.0.1.25 : 443</text>
  <path class="dg-line" d="M162 56 H298" marker-end="url(#dg0206a-ar)"/><path class="dg-line" d="M460 56 H596" marker-end="url(#dg0206a-ar)"/>
  <text class="dg-ts" x="176" y="50">request → :443 ✔</text><text class="dg-ts" x="474" y="50">request → :443</text>
  <path class="dg-line" d="M596 88 H462" marker-end="url(#dg0206a-ar)"/><text class="dg-ts" x="474" y="116">reply → :50122</text>
  <path class="dg-line" d="M300 88 H164" marker-end="url(#dg0206a-ar)"/><text class="dg-ts" x="176" y="116">reply ✔ (saved flow)</text>
  <text class="dg-ts" x="12" y="140">The reply matches the saved flow, so no outbound rule is needed.</text>
  <text class="dg-tb" x="12" y="178">Stateless (network ACL): every packet is judged on its own</text>
  <rect class="dg-box" x="12" y="196" width="150" height="62" rx="6"/><text class="dg-t" x="26" y="218">Client</text><text class="dg-ts" x="26" y="236">198.51.100.9</text><text class="dg-ts" x="26" y="250">port 50122</text>
  <rect class="dg-info" x="300" y="196" width="160" height="62" rx="6"/><text class="dg-t" x="314" y="218">Network ACL</text><text class="dg-ts" x="314" y="236">inbound: TCP 443 allow</text><text class="dg-ts" x="314" y="250">no memory of flows</text>
  <rect class="dg-box" x="598" y="196" width="150" height="62" rx="6"/><text class="dg-t" x="612" y="218">Web server</text><text class="dg-ts" x="612" y="236">10.0.1.25 : 443</text>
  <path class="dg-line" d="M162 212 H298" marker-end="url(#dg0206a-ar)"/><path class="dg-line" d="M460 212 H596" marker-end="url(#dg0206a-ar)"/>
  <text class="dg-ts" x="176" y="206">request → :443 ✔</text><text class="dg-ts" x="474" y="206">request → :443</text>
  <path class="dg-line" d="M596 244 H462" marker-end="url(#dg0206a-ar)"/><text class="dg-ts" x="474" y="272">reply → :50122</text>
  <text class="dg-tb" x="266" y="249">✘</text>
  <rect class="dg-bad" x="12" y="284" width="736" height="64" rx="6"/>
  <text class="dg-t" x="26" y="304">The reply (dst port 50122) is a NEW packet for the NACL's outbound rules.</text>
  <text class="dg-t" x="26" y="322">Without "outbound TCP 1024–65535 allow", the reply is dropped:</text>
  <text class="dg-t" x="26" y="340">the client sees a timeout, even though the request arrived.</text>
</svg>
<figcaption>Figure M02-10. Stateful filters track connections, so you write rules for the initiating direction only. Stateless filters need rules for both directions, including ephemeral ports.</figcaption>
</figure>`;

var DG_0206_PROXY = `
<figure>
<svg class="diagram" viewBox="0 0 760 290" role="img" aria-labelledby="dg0206bt dg0206bd">
  <title id="dg0206bt">Forward proxy versus reverse proxy</title>
  <desc id="dg0206bd">A forward proxy sits in front of clients inside an organisation and sends their requests out to the internet, enforcing egress policy. A reverse proxy sits in front of servers and receives requests from internet clients, providing TLS termination, caching, load balancing and filtering.</desc>
  <defs><marker id="dg0206b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <text class="dg-tb" x="12" y="22">Forward proxy: acts for CLIENTS (outbound / egress)</text>
  <rect class="dg-region" x="12" y="32" width="380" height="104" rx="10"/><text class="dg-ts" x="22" y="48">Your network (VPC / office)</text>
  <rect class="dg-box" x="26" y="58" width="110" height="30" rx="5"/><text class="dg-t" x="40" y="78">App server</text>
  <rect class="dg-box" x="26" y="96" width="110" height="30" rx="5"/><text class="dg-t" x="40" y="116">Laptop</text>
  <rect class="dg-edge" x="220" y="62" width="160" height="58" rx="6"/><text class="dg-t" x="232" y="84">Forward proxy</text><text class="dg-ts" x="232" y="102">allow-list of domains</text>
  <path class="dg-line" d="M136 73 L218 86" marker-end="url(#dg0206b-ar)"/><path class="dg-line" d="M136 111 L218 98" marker-end="url(#dg0206b-ar)"/>
  <rect class="dg-box" x="560" y="46" width="188" height="30" rx="5"/><text class="dg-t" x="572" y="66">api.partner.com ✔</text>
  <rect class="dg-bad" x="560" y="96" width="188" height="30" rx="5"/><text class="dg-t" x="572" y="116">evil.example ✘ blocked</text>
  <path class="dg-line" d="M380 80 L558 62" marker-end="url(#dg0206b-ar)"/>
  <path class="dg-line" d="M380 102 L470 108" stroke-dasharray="4 3"/><text class="dg-ts" x="420" y="128">denied</text>

  <text class="dg-tb" x="12" y="170">Reverse proxy: acts for SERVERS (inbound)</text>
  <rect class="dg-box" x="12" y="186" width="130" height="30" rx="5"/><text class="dg-t" x="24" y="206">Internet users</text>
  <rect class="dg-box" x="12" y="226" width="130" height="30" rx="5"/><text class="dg-t" x="24" y="246">Mobile apps</text>
  <rect class="dg-edge" x="220" y="190" width="200" height="74" rx="6"/><text class="dg-t" x="232" y="210">Reverse proxy</text><text class="dg-ts" x="232" y="228">TLS termination · cache · WAF</text><text class="dg-ts" x="232" y="244">load balancing · auth</text><text class="dg-ts" x="232" y="258">e.g. CloudFront, ALB, nginx</text>
  <path class="dg-line" d="M142 201 L218 215" marker-end="url(#dg0206b-ar)"/><path class="dg-line" d="M142 241 L218 235" marker-end="url(#dg0206b-ar)"/>
  <rect class="dg-region" x="490" y="180" width="258" height="96" rx="10"/><text class="dg-ts" x="500" y="196">Private servers (never exposed)</text>
  <rect class="dg-box" x="504" y="204" width="110" height="28" rx="5"/><text class="dg-t" x="516" y="223">App A</text>
  <rect class="dg-box" x="504" y="240" width="110" height="28" rx="5"/><text class="dg-t" x="516" y="259">App B</text>
  <path class="dg-line" d="M420 220 L502 218" marker-end="url(#dg0206b-ar)"/><path class="dg-line" d="M420 236 L502 252" marker-end="url(#dg0206b-ar)"/>
</svg>
<figcaption>Figure M02-11. Same mechanism, opposite direction: a forward proxy hides and controls clients; a reverse proxy hides and protects servers.</figcaption>
</figure>`;

var DG_0206_VPN = `
<figure>
<svg class="diagram" viewBox="0 0 760 230" role="img" aria-labelledby="dg0206ct dg0206cd">
  <title id="dg0206ct">Site-to-Site VPN with two IPsec tunnels</title>
  <desc id="dg0206cd">An on-premises customer gateway device connects over the internet to an AWS Site-to-Site VPN connection terminating on a virtual private gateway or transit gateway. Each VPN connection has two tunnels to two different AWS endpoints. Inside the tunnels, packets between 192.168.0.0/16 and 10.0.0.0/16 are encrypted with ESP.</desc>
  <defs><marker id="dg0206c-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-region" x="12" y="20" width="200" height="190" rx="10"/><text class="dg-ta" x="24" y="42">On-premises</text><text class="dg-ts" x="24" y="58">192.168.0.0/16</text>
  <rect class="dg-box" x="30" y="110" width="166" height="56" rx="6"/><text class="dg-t" x="42" y="132">Customer gateway</text><text class="dg-ts" x="42" y="150">router / firewall, public IP</text>
  <rect class="dg-info" x="262" y="40" width="236" height="150" rx="10"/><text class="dg-tb" x="276" y="62">Internet (underlay)</text>
  <text class="dg-ts" x="276" y="80">IKE: UDP 500 · NAT-T: UDP 4500</text>
  <text class="dg-ts" x="276" y="96">payload: ESP (IP protocol 50)</text>
  <path class="dg-link" d="M196 128 C300 110 420 100 560 90"/><text class="dg-ts" x="300" y="122">Tunnel 1 (overlay)</text>
  <path class="dg-link" d="M196 150 C300 160 420 170 560 168"/><text class="dg-ts" x="300" y="176">Tunnel 2 (overlay)</text>
  <rect class="dg-region" x="548" y="20" width="200" height="190" rx="10"/><text class="dg-ta" x="560" y="42">AWS Region</text>
  <rect class="dg-edge" x="562" y="72" width="172" height="34" rx="6"/><text class="dg-ts" x="572" y="93">AWS endpoint A</text>
  <rect class="dg-edge" x="562" y="150" width="172" height="34" rx="6"/><text class="dg-ts" x="572" y="171">AWS endpoint B</text>
  <rect class="dg-good" x="590" y="114" width="124" height="28" rx="6"/><text class="dg-ts" x="600" y="132">VGW or TGW</text>
  <text class="dg-ts" x="560" y="202">VPC 10.0.0.0/16</text>
</svg>
<figcaption>Figure M02-12. Each AWS Site-to-Site VPN connection has two tunnels to separate AWS endpoints. Configure both on your device for redundancy.</figcaption>
</figure>`;

LESSONS.push({
  id: "M02.06", title: "VPNs, firewalls and proxies", level: 200, minutes: 55,
  objectives: [
    "Compare packet filters, stateful firewalls, next-generation/L7 firewalls, IDS/IPS and WAFs, and place each in a defense-in-depth design",
    "Write correct stateful (security group) and stateless (network ACL) rules for a three-tier application, including ephemeral ports",
    "Explain how an IPsec VPN tunnel is built (IKE phases, ESP, NAT-T) and contrast site-to-site VPN, client VPN and private circuits",
    "Distinguish forward and reverse proxies and map each to AWS services (Network Firewall, CloudFront, ALB, API Gateway)",
    "Replace bastion hosts with Session Manager and justify the security benefits"
  ],
  sections: [
    { type: "why", html: `
<p>A bank is moving its loan-processing system to AWS. The security team gives the architect three requirements: <em>"Only the load balancer may talk to the app servers. The app servers may call only two partner APIs on the internet, nothing else. Branch offices must reach the system over an encrypted link until the dedicated line is installed."</em></p>
<p>Those three sentences map to three building blocks of this lesson: <strong>firewalls</strong> (security groups, NACLs), <strong>proxies and egress filtering</strong> (a forward proxy or AWS Network Firewall with domain rules), and <strong>VPNs</strong> (Site-to-Site VPN now, Direct Connect later). Domain 1 of the exam (Secure Architectures, 30%) is built on these ideas, and you will need them in every real design review.</p>` },

    { type: "concept", title: "Firewalls: from packet filters to WAFs", html: `
<p>A <strong>firewall</strong> decides which traffic may pass between two networks or into a host, based on rules. Firewalls differ in <em>how much they remember</em> and <em>how deep they look</em>.</p>
<table>
<thead><tr><th>Type</th><th>Looks at</th><th>Remembers connections?</th><th>Example</th><th>AWS equivalent</th></tr></thead>
<tbody>
<tr><td><strong>Stateless packet filter</strong></td><td>Layer 3/4 headers: IPs, protocol, ports</td><td>No. Each packet is judged alone.</td><td>Router ACLs, iptables without conntrack</td><td><strong>Network ACL</strong> (subnet level)</td></tr>
<tr><td><strong>Stateful firewall</strong></td><td>L3/L4 + connection state</td><td>Yes. Replies to allowed flows pass automatically.</td><td>iptables with conntrack, most hardware firewalls</td><td><strong>Security group</strong> (ENI level)</td></tr>
<tr><td><strong>Next-generation (NGFW) / L7 firewall</strong></td><td>Application protocol, domain names (SNI/Host), signatures, users</td><td>Yes</td><td>Palo Alto, Fortinet, Suricata</td><td><strong>AWS Network Firewall</strong>; third-party appliances behind <strong>Gateway Load Balancer</strong></td></tr>
<tr><td><strong>Web Application Firewall (WAF)</strong></td><td>HTTP requests: URI, headers, body, query string, rate</td><td>Per request</td><td>ModSecurity, Cloudflare WAF</td><td><strong>AWS WAF</strong> on CloudFront, ALB, API Gateway, AppSync, Cognito</td></tr>
</tbody></table>
<h3>Stateful vs stateless in detail</h3>
<p>When a client at <code>198.51.100.9</code> connects to your web server, the request is <code>TCP 198.51.100.9:50122 → 10.0.1.25:443</code>. The reply goes the other way: <code>TCP 10.0.1.25:443 → 198.51.100.9:50122</code>. The reply's destination port is the client's <strong>ephemeral port</strong>, unpredictable, somewhere in 1024–65535.</p>
<ul>
  <li>A <strong>stateful</strong> firewall puts the request's 5-tuple in a connection-tracking table. The reply matches the table entry and is allowed, with no outbound rule needed.</li>
  <li>A <strong>stateless</strong> filter has no table. The reply is just a packet to port 50122, so you must explicitly allow outbound TCP 1024–65535, or the client times out.</li>
</ul>` + DG_0206_STATE + `
<h3>Allow-lists, deny-lists and default deny</h3>
<ul>
  <li><strong>Default deny:</strong> anything not explicitly allowed is blocked. It is the safest baseline: a new service is unreachable until someone deliberately opens it. Security groups are default-deny for inbound traffic.</li>
  <li><strong>Allow-list (positive security):</strong> list what is permitted (port 443 from the ALB). Strong, and easy to audit.</li>
  <li><strong>Deny-list (negative security):</strong> list what is forbidden (block this IP range, this country, this SQL pattern). Useful for reacting to a known threat, but never complete. Security groups <em>cannot</em> deny. Use NACL deny rules or AWS WAF IP sets to block a specific attacker.</li>
</ul>
<h3>IDS vs IPS</h3>
<ul>
  <li>An <strong>Intrusion Detection System (IDS)</strong> watches a copy of the traffic and <em>alerts</em> on suspicious patterns. It is out of band and doesn't block. On AWS: VPC Traffic Mirroring to a sensor, or Amazon GuardDuty (threat detection from VPC Flow Logs, DNS logs and CloudTrail).</li>
  <li>An <strong>Intrusion Prevention System (IPS)</strong> sits <em>inline</em> and <em>drops</em> malicious traffic. On AWS: Network Firewall stateful rules in Suricata format, or an IPS appliance behind Gateway Load Balancer.</li>
</ul>
<h3>Web application firewalls</h3>
<p>A WAF protects HTTP applications against application-layer attacks that L3/L4 firewalls can't see, because they arrive on an allowed port 443. Typical protections:</p>
<ul>
  <li><strong>SQL injection (SQLi):</strong> <code>?id=1 OR 1=1</code> in a parameter, aimed at a database query built from user input.</li>
  <li><strong>Cross-site scripting (XSS):</strong> <code>&lt;script&gt;</code> injected into a page other users will view.</li>
  <li><strong>OWASP Top 10</strong> categories (broken access control, injection, security misconfiguration…), known bad inputs, malicious bots.</li>
  <li><strong>Rate limiting:</strong> block an IP that sends more than N requests in a time window (credential stuffing, scraping, application-layer DDoS).</li>
  <li><strong>Geo match and IP reputation lists.</strong></li>
</ul>
<h3>Defense in depth</h3>
<p>No single control is enough. Layer them so that a misconfiguration in one is caught by another:</p>
<table>
<thead><tr><th>Layer</th><th>Control on AWS</th></tr></thead>
<tbody>
<tr><td>Edge</td><td>CloudFront + AWS WAF + Shield (DDoS), Route 53</td></tr>
<tr><td>VPC perimeter</td><td>Public/private subnets, internet and NAT gateways, Network Firewall, NACLs</td></tr>
<tr><td>Instance / ENI</td><td>Security groups (least privilege, referencing other SGs)</td></tr>
<tr><td>Host</td><td>Patching (Systems Manager), host firewall, Amazon Inspector</td></tr>
<tr><td>Application</td><td>Authentication, input validation, TLS, secrets in Secrets Manager</td></tr>
<tr><td>Data</td><td>Encryption with KMS, IAM and resource policies, backups</td></tr>
<tr><td>Detection</td><td>VPC Flow Logs, GuardDuty, Security Hub, CloudTrail</td></tr>
</tbody></table>` },

    { type: "concept", title: "VPNs: private tunnels over public networks", html: `
<p>A <strong>Virtual Private Network (VPN)</strong> creates a <strong>tunnel</strong>: each original packet is wrapped (encapsulated) inside another packet, and usually encrypted, so that two private networks can talk across an untrusted network such as the internet as if they were directly connected.</p>
<ul>
  <li>The <strong>underlay</strong> is the network that physically carries the packets (the internet, using public IPs).</li>
  <li>The <strong>overlay</strong> is the logical network inside the tunnel (your private 10.x and 192.168.x addresses).</li>
</ul>
<h3>IPsec, the site-to-site standard</h3>
<table>
<thead><tr><th>Component</th><th>What it does</th></tr></thead>
<tbody>
<tr><td><strong>IKE (Internet Key Exchange)</strong>, UDP 500</td><td>Authenticates the peers (pre-shared key or certificates) and negotiates keys.<br><strong>Phase 1</strong> builds a secure management channel (IKE SA).<br><strong>Phase 2</strong> negotiates the IPsec SAs that will encrypt the actual data (which subnets, which ciphers, key lifetime).</td></tr>
<tr><td><strong>ESP (Encapsulating Security Payload)</strong>, IP protocol 50</td><td>Encrypts and authenticates the payload. This is what carries your traffic.</td></tr>
<tr><td><strong>AH (Authentication Header)</strong>, IP protocol 51</td><td>Integrity and authentication <em>without</em> encryption. Rarely used today, and incompatible with NAT.</td></tr>
<tr><td><strong>Tunnel mode</strong></td><td>The whole original IP packet is encrypted and a new outer IP header (gateway to gateway) is added. Used for site-to-site VPNs.</td></tr>
<tr><td><strong>Transport mode</strong></td><td>Only the payload is protected and the original IP header is kept. Used host to host.</td></tr>
<tr><td><strong>NAT traversal (NAT-T)</strong>, UDP 4500</td><td>ESP has no ports, so NAT/PAT devices can't track it. NAT-T wraps ESP in UDP 4500 when a NAT is detected between the peers.</td></tr>
<tr><td><strong>Dead Peer Detection (DPD)</strong></td><td>Detects a dead tunnel so traffic can fail over to the other tunnel.</td></tr>
</tbody></table>` + DG_0206_VPN + `
<h3>Types of VPN</h3>
<table>
<thead><tr><th>Type</th><th>Connects</th><th>Typical technology</th><th>AWS service</th></tr></thead>
<tbody>
<tr><td><strong>Site-to-site</strong></td><td>A whole network (data centre, branch) to another network (VPC)</td><td>IPsec between two gateways</td><td><strong>AWS Site-to-Site VPN</strong></td></tr>
<tr><td><strong>Remote access / client VPN</strong></td><td>Individual users' devices to a network</td><td>TLS-based (OpenVPN) or IPsec client software</td><td><strong>AWS Client VPN</strong> (OpenVPN-based; auth via Active Directory, SAML or certificates)</td></tr>
<tr><td><strong>SSL/TLS VPN</strong></td><td>Usually remote users; works through restrictive firewalls because it uses TCP/UDP 443</td><td>OpenVPN, vendor SSL VPNs</td><td>Client VPN</td></tr>
</tbody></table>
<h3>VPN over the internet vs a private circuit</h3>
<table>
<thead><tr><th></th><th>Site-to-Site VPN</th><th>Direct Connect (DX)</th></tr></thead>
<tbody>
<tr><td>Path</td><td>Public internet</td><td>Dedicated private fibre from a DX location to AWS</td></tr>
<tr><td>Set-up time</td><td>Minutes to hours</td><td>Weeks to months (circuit provisioning)</td></tr>
<tr><td>Bandwidth</td><td>About 1.25 Gbps per tunnel. Scale with ECMP across multiple VPNs on a Transit Gateway.</td><td>Dedicated connections from 1 to 100 Gbps; hosted connections from 50 Mbps</td></tr>
<tr><td>Latency and jitter</td><td>Variable (internet weather)</td><td>Consistent, predictable</td></tr>
<tr><td>Encryption</td><td>Yes (IPsec)</td><td><strong>Not encrypted by default</strong>. Add MACsec (on supported dedicated connections) or run a VPN over DX.</td></tr>
<tr><td>Cost model</td><td>Low hourly charge per connection + data transfer out</td><td>Port-hours + lower data transfer out rates (cheaper for large volumes)</td></tr>
</tbody></table>
<div class="callout tip">The classic hybrid pattern: <strong>start with a VPN</strong> (fast to set up), <strong>move to Direct Connect</strong> for consistent performance and volume, and <strong>keep the VPN as a backup</strong> path for DX. Deep dive in <strong>M11</strong>.</div>` },

    { type: "concept", title: "Proxies: forward, reverse and everything in between", html: `
<p>A <strong>proxy</strong> is an intermediary that terminates a connection from one side and opens a new connection to the other side. Because it sees the full request, it can enforce policy, cache, log and rewrite.</p>` + DG_0206_PROXY + `
<table>
<thead><tr><th></th><th>Forward proxy</th><th>Reverse proxy</th></tr></thead>
<tbody>
<tr><td>Acts on behalf of</td><td>Clients</td><td>Servers</td></tr>
<tr><td>Direction</td><td>Outbound (egress) from your network</td><td>Inbound (ingress) to your services</td></tr>
<tr><td>Who knows about it</td><td>Clients are configured to use it (<code>HTTPS_PROXY=…</code>), unless it is transparent</td><td>Clients think it <em>is</em> the server</td></tr>
<tr><td>Main purposes</td><td>Egress control (domain allow-lists), content filtering, caching, hiding internal IPs, audit logging</td><td>TLS termination, load balancing, caching, WAF, authentication, compression, hiding origin servers</td></tr>
<tr><td>Examples</td><td>Squid, corporate web proxies, Zscaler</td><td>nginx, HAProxy, Envoy, CDNs</td></tr>
<tr><td>AWS</td><td>Squid on EC2 behind an NLB; <strong>AWS Network Firewall</strong> domain filtering is the managed alternative for egress control</td><td><strong>CloudFront</strong>, <strong>ALB</strong>, <strong>API Gateway</strong>, App Runner and VPC Lattice front ends</td></tr>
</tbody></table>
<ul>
  <li>A <strong>transparent proxy</strong> intercepts traffic without client configuration (via routing). Clients don't know it is there. Network Firewall in the routing path behaves this way for egress domain filtering, which it does by reading the TLS SNI or HTTP Host header without decrypting.</li>
  <li>An <strong>API gateway</strong> is a specialised reverse proxy for APIs: authentication (API keys, JWT, IAM), throttling, request validation and transformation, usage plans.</li>
  <li>A <strong>CDN</strong> is a geographically distributed reverse proxy: edge locations cache content close to users and shield the origin.</li>
</ul>
<h3>Bastion hosts vs Session Manager</h3>
<p>A <strong>bastion host</strong> (jump box) is a hardened instance in a public subnet that admins SSH into, then hop from to private instances. It works, but it has downsides: an open port 22 on the internet, SSH keys to distribute and rotate, a server to patch, and weak auditing of what was typed.</p>
<p><strong>AWS Systems Manager Session Manager</strong> replaces it. The SSM Agent on the instance makes an <em>outbound</em> HTTPS connection to Systems Manager (directly, through NAT, or through VPC interface endpoints). Admins open a shell from the console or CLI, authorised by <strong>IAM</strong>.</p>
<ul>
  <li>No inbound ports and no SSH keys. The instance can sit in a private subnet with no internet route (using VPC endpoints).</li>
  <li>Every session is logged to CloudTrail, with full session transcripts optionally in S3 or CloudWatch Logs.</li>
  <li>Port forwarding works too, e.g. to reach an RDS database from your laptop through an instance.</li>
</ul>` },

    { type: "workflow", title: "Step by step: bringing up an IPsec tunnel and sending a packet", html: `
<ol class="flow">
  <li><strong>Configuration:</strong> on AWS you create a <em>customer gateway</em> (your device's public IP and BGP ASN), a <em>virtual private gateway</em> (attached to a VPC) or <em>transit gateway</em>, and a <em>VPN connection</em>. AWS gives you two tunnel endpoints, pre-shared keys and a sample config for your device vendor.</li>
  <li><strong>IKE phase 1 (UDP 500):</strong> your device and the AWS endpoint authenticate each other with the pre-shared key (or certificate) and run a Diffie-Hellman exchange. Result: an encrypted management channel (IKE SA).</li>
  <li><strong>NAT detection:</strong> if either side is behind NAT, both switch to UDP 4500 (NAT-T).</li>
  <li><strong>IKE phase 2:</strong> inside that channel they negotiate the IPsec SAs: encryption (e.g. AES-256-GCM), integrity, and which traffic (traffic selectors) goes in the tunnel. Keys are refreshed periodically (rekeying).</li>
  <li><strong>Routing:</strong> with <em>dynamic</em> routing, a BGP session runs inside each tunnel and each side advertises its prefixes (192.168.0.0/16 ↔ 10.0.0.0/16). With <em>static</em> routing you type the prefixes in. In the VPC, enable <strong>route propagation</strong> on the route tables or add a route to the VGW.</li>
  <li><strong>Packet send:</strong> a server at 192.168.10.5 sends to 10.0.2.40. The on-premises router's route points at the tunnel. The original packet is encrypted with ESP and wrapped in a new IP header (your public IP → the AWS endpoint public IP), then sent across the internet.</li>
  <li><strong>Decapsulation:</strong> the AWS endpoint verifies integrity, decrypts, and delivers the original packet into the VPC. The VPC route table, NACL and security group still apply. The SG must allow 192.168.0.0/16.</li>
  <li><strong>Failover:</strong> if tunnel 1's endpoint goes down (AWS maintenance does this deliberately, one tunnel at a time), DPD and BGP withdraw its routes and traffic moves to tunnel 2. Configure <em>both</em> tunnels, or maintenance will cause an outage.</li>
</ol>` },

    { type: "aws", title: "AWS mapping: which control does what", html: `
<table>
<thead><tr><th>Concept</th><th>AWS service</th><th>Key facts for the exam</th></tr></thead>
<tbody>
<tr><td>Stateful host firewall</td><td><strong>Security group</strong></td><td>Attached to ENIs (instances, RDS, Lambda in VPC, endpoints). <strong>Allow rules only.</strong> Stateful. Can reference other security groups as source. All rules are evaluated together. Default: deny all inbound, allow all outbound.</td></tr>
<tr><td>Stateless subnet filter</td><td><strong>Network ACL</strong></td><td>Attached to subnets. <strong>Allow and deny.</strong> Stateless (needs ephemeral return rules). Numbered rules evaluated lowest first; the first match wins. The default NACL allows all; a new custom NACL denies all.</td></tr>
<tr><td>Web application firewall</td><td><strong>AWS WAF</strong></td><td>Web ACLs with managed rule groups (core rule set, SQLi, known bad inputs, bot control), rate-based rules, IP sets, geo match. Attaches to CloudFront, ALB, API Gateway, AppSync, Cognito user pools, App Runner, Verified Access.</td></tr>
<tr><td>DDoS protection</td><td><strong>AWS Shield</strong></td><td><strong>Standard:</strong> automatic and free, L3/L4 protection for everyone. <strong>Advanced:</strong> paid, enhanced detection, 24/7 Shield Response Team, cost protection for scaling during attacks, WAF included for protected resources.</td></tr>
<tr><td>Managed network firewall / IPS</td><td><strong>AWS Network Firewall</strong></td><td>Deployed in its own subnets per AZ, with routing sending traffic through it. Stateless and stateful rule groups, <strong>domain-name allow/deny lists</strong> (HTTP Host / TLS SNI), Suricata-compatible IPS rules. Use it for egress filtering and VPC-to-VPC inspection.</td></tr>
<tr><td>Third-party firewall appliances</td><td><strong>Gateway Load Balancer</strong></td><td>Transparently distributes traffic to a fleet of virtual appliances (Palo Alto, Fortinet…) using <strong>GENEVE on UDP 6081</strong>. You route to it through Gateway Load Balancer endpoints. "Bring your existing firewall vendor" → GWLB.</td></tr>
<tr><td>DNS-level filtering</td><td><strong>Route 53 Resolver DNS Firewall</strong></td><td>Blocks lookups of malicious or non-approved domains from the VPC (stops DNS-based exfiltration and malware call-backs).</td></tr>
<tr><td>Site-to-site VPN</td><td><strong>AWS Site-to-Site VPN</strong></td><td>IPsec. <strong>2 tunnels per connection</strong>. Terminates on a <strong>virtual private gateway (VGW)</strong> for one VPC or a <strong>transit gateway (TGW)</strong> for many. About 1.25 Gbps per tunnel. ECMP across tunnels/connections only with a TGW. Static or BGP routing. Accelerated VPN option uses Global Accelerator.</td></tr>
<tr><td>Remote-user VPN</td><td><strong>AWS Client VPN</strong></td><td>Managed OpenVPN endpoint. Authenticates with Active Directory, SAML (IAM Identity Center/IdP) or mutual certificates. Authorization rules per network.</td></tr>
<tr><td>Private circuit</td><td><strong>AWS Direct Connect</strong></td><td>Consistent bandwidth and latency. Not encrypted by default: use <strong>MACsec</strong> or a <strong>Site-to-Site VPN over DX</strong> (public VIF or transit VIF) when encryption is required.</td></tr>
<tr><td>Reverse proxies</td><td><strong>CloudFront, ALB, API Gateway</strong></td><td>TLS termination, caching (CloudFront), L7 routing (ALB), auth and throttling (API Gateway). All integrate with AWS WAF.</td></tr>
<tr><td>Bastion replacement</td><td><strong>Systems Manager Session Manager</strong></td><td>No inbound ports, no keys, IAM-controlled, sessions logged. Also <strong>EC2 Instance Connect Endpoint</strong> for SSH to private instances without a public IP.</td></tr>
</tbody></table>
<h3>Security group vs network ACL</h3>
<table>
<thead><tr><th></th><th>Security group</th><th>Network ACL</th></tr></thead>
<tbody>
<tr><td>Operates at</td><td>ENI / instance level</td><td>Subnet level</td></tr>
<tr><td>State</td><td><strong>Stateful</strong>: return traffic allowed automatically</td><td><strong>Stateless</strong>: return traffic needs explicit rules</td></tr>
<tr><td>Rule types</td><td>Allow only</td><td>Allow <strong>and deny</strong></td></tr>
<tr><td>Evaluation</td><td>All rules evaluated; if any allows, traffic passes</td><td>In number order; the <strong>first match wins</strong>; final <code>*</code> rule denies</td></tr>
<tr><td>Source types</td><td>CIDR, prefix list, <strong>another security group</strong></td><td>CIDR only</td></tr>
<tr><td>Default</td><td>Inbound: deny all. Outbound: allow all.</td><td>Default NACL: allow all both ways. Custom NACL: deny all.</td></tr>
<tr><td>Typical use</td><td>Primary, fine-grained control</td><td>Coarse guardrails, <strong>blocking specific IPs</strong>, subnet isolation</td></tr>
</tbody></table>
<p>Deep dives: <strong>M09</strong> (VPC security), <strong>M10</strong> (Transit Gateway, endpoints), <strong>M11</strong> (VPN, Direct Connect), <strong>M08</strong> (WAF, Shield, Network Firewall, GuardDuty).</p>` },

    { type: "examples", title: "Worked example: rules for a three-tier application", html: `
<p>Architecture: internet → <strong>ALB</strong> in public subnets (10.0.0.0/24, 10.0.1.0/24) → <strong>app instances</strong> on port 8080 in private subnets (10.0.10.0/24, 10.0.11.0/24) → <strong>Aurora MySQL</strong> on port 3306 in database subnets (10.0.20.0/24, 10.0.21.0/24).</p>
<h3>Security groups: a chain by reference</h3>
<table>
<thead><tr><th>Security group</th><th>Inbound rules</th><th>Outbound rules</th></tr></thead>
<tbody>
<tr><td><code>alb-sg</code></td><td>TCP 443 from <code>0.0.0.0/0</code> (and <code>::/0</code>)<br>TCP 80 from <code>0.0.0.0/0</code> (redirect to 443)</td><td>TCP 8080 to <code>app-sg</code></td></tr>
<tr><td><code>app-sg</code></td><td>TCP 8080 from <strong><code>alb-sg</code></strong></td><td>TCP 3306 to <code>db-sg</code>; TCP 443 to <code>0.0.0.0/0</code> (AWS APIs and partner APIs, through NAT)</td></tr>
<tr><td><code>db-sg</code></td><td>TCP 3306 from <strong><code>app-sg</code></strong></td><td>None needed (stateful replies are automatic)</td></tr>
</tbody></table>
<p>Referencing security groups instead of CIDRs means that when Auto Scaling adds an app instance with a new IP, it is automatically allowed into the database, and <em>only</em> members of <code>app-sg</code> are. Nothing else in the VPC can reach port 3306.</p>
<h3>Matching network ACL for the app subnets (stateless)</h3>
<pre><code>Inbound rules (app subnets)
 Rule  Type   Port         Source           Action   Why
 100   TCP    8080         10.0.0.0/23      ALLOW    requests from the ALB subnets
 110   TCP    1024-65535   10.0.20.0/23     ALLOW    replies from the database
 120   TCP    1024-65535   0.0.0.0/0        ALLOW    replies from internet APIs (via NAT)
 *     ALL    ALL          0.0.0.0/0        DENY

Outbound rules (app subnets)
 Rule  Type   Port         Destination      Action   Why
 100   TCP    1024-65535   10.0.0.0/23      ALLOW    replies to the ALB's ephemeral ports
 110   TCP    3306         10.0.20.0/23     ALLOW    queries to the database
 120   TCP    443          0.0.0.0/0        ALLOW    outbound HTTPS (via NAT gateway)
 *     ALL    ALL          0.0.0.0/0        DENY</code></pre>
<ul>
  <li>Inbound rule 110 is easy to forget: the database's <em>replies</em> arrive at the app's ephemeral ports. Without it, every query times out even though the security groups are perfect.</li>
  <li><code>10.0.0.0/23</code> covers both ALB subnets (10.0.0.0/24 and 10.0.1.0/24) in one rule: CIDR aggregation from M02.02.</li>
  <li>To block an attacking IP for the whole subnet, add <code>Rule 50  ALL  ALL  203.0.113.66/32  DENY</code> to the <em>public</em> subnets' NACL. It has a lower number, so it is evaluated first. Security groups can't express a deny.</li>
</ul>
<h3>Diagnosing with VPC Flow Logs</h3>
<pre><code>version account eni         srcaddr     dstaddr     srcport dstport proto packets bytes start end action log-status
2  111122223333 eni-0a1b... 10.0.10.15  10.0.20.31  41870   3306    6     5       300   ...   ... ACCEPT OK
2  111122223333 eni-0a1b... 10.0.20.31  10.0.10.15  3306    41870   6     5       420   ...   ... REJECT OK</code></pre>
<p>The request was ACCEPTed and the reply (to ephemeral port 41870) was REJECTed. A rejected <em>reply</em> after an accepted <em>request</em> almost always means a <strong>stateless NACL</strong> missing its ephemeral-port rule. Security groups never reject replies to flows they allowed.</p>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>Choose</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Block one malicious IP range immediately for a whole subnet</td><td>NACL deny rule (low rule number), or an AWS WAF IP set for HTTP traffic</td><td>Security groups can't deny</td></tr>
<tr><td>App servers may call only <code>api.stripe.com</code> and <code>*.amazonaws.com</code></td><td>AWS Network Firewall with a stateful domain allow-list on the egress path (or a Squid forward proxy)</td><td>Security groups and NACLs filter by IP, not by domain name</td></tr>
<tr><td>Protect a public web app against SQL injection and bots</td><td>AWS WAF (managed rule groups + rate-based rule) on CloudFront or the ALB</td><td>L7 inspection of HTTP requests</td></tr>
<tr><td>Company standard requires their existing Palo Alto firewalls for all VPC traffic</td><td>Gateway Load Balancer with the vendor appliances, and GWLB endpoints in the routing path</td><td>Transparent, scalable insertion of third-party appliances</td></tr>
<tr><td>Branch office needs encrypted connectivity to a VPC this week</td><td>AWS Site-to-Site VPN (both tunnels configured, BGP)</td><td>Fast to set up, encrypted, low cost</td></tr>
<tr><td>Remote developers need access to private resources from laptops</td><td>AWS Client VPN with SAML authentication, or Session Manager for instance access</td><td>Per-user authentication; no public endpoints on the resources</td></tr>
<tr><td>Admins need shell access to private instances without opening port 22</td><td>Systems Manager Session Manager</td><td>No inbound ports, IAM auth, session logging</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: see the filters work (free)", html: `
<p>Linux/WSL, no AWS charges.</p>
<pre><code># 1. See the kernel's connection-tracking (stateful) table while you browse
sudo apt-get install -y conntrack     # or: sudo dnf install -y conntrack-tools
curl -s https://example.com &gt; /dev/null &amp;
sudo conntrack -L -p tcp --dport 443 2&gt;/dev/null | head
#   tcp 6 431999 ESTABLISHED src=172.20.1.5 dst=93.184.215.14 sport=51514 dport=443 ... [ASSURED]
#   ↑ this saved 5-tuple is why replies pass a stateful firewall

# 2. Use an HTTP forward proxy explicitly (any proxy you can reach; here a local tinyproxy)
sudo apt-get install -y tinyproxy &amp;&amp; sudo systemctl start tinyproxy   # listens on 8888
HTTPS_PROXY=http://127.0.0.1:8888 curl -sv https://example.com -o /dev/null 2&gt;&amp;1 | grep -E "CONNECT|Proxy"
#   &gt; CONNECT example.com:443 HTTP/1.1    ← the client asks the proxy to open a tunnel
#   &lt; HTTP/1.1 200 Connection established ← the proxy saw the DOMAIN, not the encrypted content

# 3. Reverse proxy headers: what the backend sees
curl -s https://httpbin.org/headers | grep -i -E "x-forwarded|x-amzn"</code></pre>
<p>Optional, in your AWS account (CloudShell, free resources only): list the rules of your default VPC's security groups and NACLs.</p>
<pre><code>aws ec2 describe-security-groups --query "SecurityGroups[].{Name:GroupName,In:IpPermissions[].{P:IpProtocol,From:FromPort,To:ToPort,Src:IpRanges[].CidrIp,SG:UserIdGroupPairs[].GroupId}}"
aws ec2 describe-network-acls --query "NetworkAcls[].{Id:NetworkAclId,Default:IsDefault,Entries:Entries[].[RuleNumber,Egress,Protocol,PortRange.From,PortRange.To,CidrBlock,RuleAction]}"</code></pre>
<p>Notice the default NACL's rule 100 (allow all) and <code>*</code> (deny all) in each direction.</p>` },

    { type: "casestudy", title: "Case study: Northwind Credit's hybrid, egress-controlled platform", html: `
<p><strong>Company:</strong> Northwind Credit, a fictional regional lender regulated by a financial authority. It is moving its loan-origination platform from a data centre to AWS (<code>eu-central-1</code>).</p>
<h3>Requirements</h3>
<ol>
  <li>The platform must reach two on-premises systems (core banking and the credit bureau gateway) with <strong>encrypted</strong> traffic. Go-live is in 6 weeks, but the Direct Connect order takes about 12 weeks.</li>
  <li>Auditors require that application servers can reach <strong>only approved internet domains</strong> (a payment provider and AWS APIs). Any other outbound connection must be blocked and logged.</li>
  <li>No inbound administrative ports. All admin access must be attributable to a named person.</li>
  <li>The public loan-application website must be protected against OWASP Top 10 attacks and credential stuffing.</li>
</ol>
<h3>Design</h3>
<table>
<thead><tr><th>Requirement</th><th>Decision</th><th>Rejected alternative and why</th></tr></thead>
<tbody>
<tr><td>1. Hybrid now</td><td>Site-to-Site VPN to a <strong>Transit Gateway</strong>, two connections from two on-premises routers (4 tunnels), BGP, ECMP</td><td>Waiting for DX: misses the deadline</td></tr>
<tr><td>1. Hybrid later</td><td>Direct Connect (2 × 1 Gbps at two locations) to the same TGW; <strong>VPN kept as backup</strong>; MACsec on DX for encryption</td><td>DX alone without encryption: fails the encryption requirement</td></tr>
<tr><td>2. Egress control</td><td>Centralised egress VPC: TGW → <strong>AWS Network Firewall</strong> (stateful domain allow-list on SNI, alert logs to S3) → NAT gateway → internet gateway. Plus <strong>Route 53 Resolver DNS Firewall</strong> blocking non-approved domains.</td><td>Security groups to the payment provider's IPs: those IPs change and can't be enumerated</td></tr>
<tr><td>3. Admin access</td><td><strong>Session Manager</strong> through VPC interface endpoints; sessions logged to S3 and CloudWatch; access via IAM Identity Center groups</td><td>Bastion host: open port 22 and shared SSH keys fail attributability</td></tr>
<tr><td>4. Web protection</td><td>CloudFront + <strong>AWS WAF</strong> (core rule set, SQLi, known bad inputs, account-takeover prevention, rate-based rule 100 req / 5 min per IP on <code>/login</code>) + Shield Standard</td><td>NACL deny-lists: can't see HTTP payloads</td></tr>
</tbody></table>
<h3>Result</h3>
<p>The platform went live on the VPN in week 5. The first audit found no issues with egress control: the Network Firewall alert logs showed every blocked attempt, including a third-party library trying to send telemetry to an unapproved domain. When Direct Connect arrived, BGP route preferences moved traffic to DX with no downtime, and the VPN now carries traffic only if DX fails.</p>
<h3>Lessons learned</h3>
<ul>
  <li>Filter by <em>identity</em> (security group references, domains, IAM) rather than by IP wherever possible. IPs change; identities don't.</li>
  <li>Design hybrid connectivity as a journey: VPN first, DX later, VPN as backup.</li>
  <li>Egress control is a common audit finding. Centralising it (one inspection VPC) is cheaper and easier to prove than per-VPC firewalls.</li>
</ul>` },

    { type: "exam", html: `
<div class="keyword-list"><span>block a specific IP → NACL deny (or WAF IP set)</span><span>stateful, instance level, reference other SGs → security group</span><span>stateless, subnet, allow + deny, rule numbers → NACL</span><span>SQL injection / XSS / rate limit → AWS WAF</span><span>DDoS, response team, cost protection → Shield Advanced</span><span>filter outbound by domain name → Network Firewall</span><span>third-party firewall appliances → Gateway Load Balancer</span><span>encrypted connection over internet quickly → Site-to-Site VPN</span><span>consistent latency, high bandwidth → Direct Connect</span><span>encrypt DX → MACsec or VPN over DX</span><span>remote users → Client VPN</span><span>no bastion, no port 22 → Session Manager</span></div>
<table>
<thead><tr><th>Confusable pair</th><th>How to tell them apart</th></tr></thead>
<tbody>
<tr><td>Security group vs NACL</td><td>SG: stateful, allow-only, ENI, SG references. NACL: stateless, allow+deny, subnet, ordered rules, ephemeral ports needed.</td></tr>
<tr><td>AWS WAF vs Shield</td><td>WAF: L7 rules you write (SQLi, XSS, rates). Shield: DDoS protection (Standard free L3/L4; Advanced adds L7 help with WAF, the response team and cost protection).</td></tr>
<tr><td>Network Firewall vs WAF</td><td>Network Firewall: VPC traffic of any protocol, domain lists, IPS. WAF: HTTP(S) only, on front-door services.</td></tr>
<tr><td>VGW vs TGW for VPN</td><td>VGW: one VPC, no ECMP. TGW: many VPCs, ECMP across VPN tunnels for more bandwidth.</td></tr>
<tr><td>Site-to-Site VPN vs Client VPN</td><td>Networks to networks vs individual users' devices to networks.</td></tr>
<tr><td>Forward vs reverse proxy</td><td>Forward: protects and controls clients going out. Reverse: protects and fronts servers coming in.</td></tr>
</tbody></table>
<p><strong>Common distractors:</strong> "Add a deny rule to the security group" (impossible). "Direct Connect is encrypted" (it isn't, by default). "Configure only one tunnel" (AWS maintenance takes tunnels down one at a time). "Use a NACL to allow traffic from another security group" (NACLs accept CIDRs only). "Use WAF to filter outbound domains from EC2" (WAF protects inbound HTTP front doors).</p>` },

    { type: "architect", html: `
<ul>
  <li><strong>Prefer security groups as the primary control</strong>, and keep NACLs simple (often the default allow-all, plus explicit denies for known bad ranges or strict segmentation for regulated subnets). Complex NACLs cause outages through forgotten ephemeral-port rules.</li>
  <li><strong>Security group quotas:</strong> rules per SG and SGs per ENI are limited (raising one lowers the other). Use <strong>managed prefix lists</strong> for large CIDR sets, and reference SGs instead of listing IPs.</li>
  <li><strong>Egress is where data leaves.</strong> Default SG outbound is "allow all", which is convenient but invites exfiltration. Regulated workloads need explicit egress rules plus domain filtering (Network Firewall, DNS Firewall) and VPC endpoints so AWS API traffic never needs the internet.</li>
  <li><strong>Network Firewall cost and placement:</strong> charged per endpoint-hour per AZ plus per GB processed. Centralise inspection in a shared inspection VPC behind a Transit Gateway rather than deploying it in every VPC. Keep routing symmetric (TGW appliance mode) so stateful inspection sees both directions.</li>
  <li><strong>VPN operations:</strong> monitor <code>TunnelState</code> in CloudWatch for both tunnels; use BGP for automatic failover; size for 1.25 Gbps per tunnel; enable VPN logs for IKE troubleshooting.</li>
  <li><strong>Troubleshooting playbook:</strong> Flow Logs REJECT on the request → SG/NACL inbound. ACCEPT on request but REJECT on reply → NACL ephemeral rule. Nothing in Flow Logs → routing (route tables, TGW, VPN propagation) or DNS. Use <strong>VPC Reachability Analyzer</strong> to check the whole path without sending traffic.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>Stateless filters judge each packet. Stateful firewalls track connections. Next-generation/L7 firewalls and WAFs inspect applications and HTTP.</li>
  <li>Security groups: stateful, allow-only, ENI level, can reference other SGs. NACLs: stateless, allow+deny, subnet level, ordered, need ephemeral return rules (1024–65535).</li>
  <li>Default deny plus allow-lists form the baseline. Use deny-lists (NACL, WAF IP sets) to react to known threats.</li>
  <li>IDS detects (out of band). IPS blocks (inline). WAF stops SQLi, XSS and abusive request rates.</li>
  <li>IPsec: IKE (UDP 500) phases 1 and 2, ESP (protocol 50) encrypts, NAT-T uses UDP 4500. Tunnel mode is used for site-to-site.</li>
  <li>AWS Site-to-Site VPN has 2 tunnels, ~1.25 Gbps each, and terminates on a VGW (one VPC) or TGW (many VPCs, ECMP). Client VPN is for users.</li>
  <li>VPN = internet, quick, variable. Direct Connect = private, consistent, not encrypted by default (MACsec or VPN over DX).</li>
  <li>Forward proxies control egress (domain allow-lists → Network Firewall). Reverse proxies front servers (CloudFront, ALB, API Gateway).</li>
  <li>Gateway Load Balancer inserts third-party appliances (GENEVE UDP 6081). Session Manager replaces bastion hosts.</li>
</ul>` }
  ],
  drills: [
    { id: "M02.06-d1", q: "A web server's NACL allows inbound TCP 443. What outbound port range must the NACL allow so replies reach clients on any OS? (format: <code>start-end</code>)", answers: ["1024-65535"], hint: "Replies go to the client's ephemeral port. Cover Linux, Windows, ELB and NAT gateway ranges.", explain: "Allow outbound TCP 1024–65535. It covers Linux (32768–60999), Windows (49152–65535), ELB and NAT gateways (1024–65535)." },
    { id: "M02.06-d2", q: "A NACL has rule 100 <code>ALLOW TCP 443 0.0.0.0/0</code> and rule 200 <code>DENY TCP 443 203.0.113.0/24</code>. Is traffic from 203.0.113.50 to port 443 allowed or denied?", answers: ["allowed", "allow"], hint: "NACL rules are evaluated in number order; the first match wins.", explain: "Allowed. Rule 100 matches first, so rule 200 is never reached. To block the range, give the deny a lower number than the allow (e.g. 50)." },
    { id: "M02.06-d3", q: "Which IP protocol number does IPsec ESP use?", answers: ["50"], hint: "AH is 51.", explain: "ESP is IP protocol 50 (not a TCP/UDP port). That is why NAT devices need NAT-T (UDP 4500) to carry it." },
    { id: "M02.06-d4", q: "What is the approximate maximum bandwidth of one AWS Site-to-Site VPN tunnel, in Gbps?", answers: ["1.25", "1.25gbps", "1.25 gbps"], hint: "Scaling beyond it needs ECMP on a Transit Gateway.", explain: "About 1.25 Gbps per tunnel. For more, use multiple VPN connections with ECMP on a Transit Gateway, or Direct Connect." },
    { id: "M02.06-d5", q: "Gateway Load Balancer sends traffic to appliances encapsulated in GENEVE. Which UDP port?", answers: ["6081", "udp 6081", "udp6081"], hint: "Four digits, starts with 6.", explain: "GENEVE uses UDP 6081. The appliances must support GENEVE to sit behind a GWLB." }
  ],
  check: [
    { id: "M02.06-k1", type: "single", domain: "D1", task: "1.2", level: 200,
      stem: "A web application is under attack from a single IP range. The security team must block that range for <strong>all instances in a public subnet</strong> immediately. What should a solutions architect do?",
      options: [
        { t: "Add an inbound DENY rule for the range to the subnet's network ACL, with a rule number lower than the existing ALLOW rules", c: true, why: "NACLs support deny rules at the subnet level, and the lowest-numbered matching rule wins." },
        { t: "Add an inbound DENY rule to the instances' security group", c: false, why: "Security groups support allow rules only." },
        { t: "Remove 0.0.0.0/0 from the security group and add every other CIDR", c: false, why: "Impractical: that is an allow-list of the entire internet minus one range." },
        { t: "Enable AWS Shield Standard on the subnet", c: false, why: "Shield Standard is automatic and protects against L3/L4 DDoS. It isn't attached to subnets and doesn't block chosen IP ranges." }
      ] },
    { id: "M02.06-k2", type: "single", domain: "D1", task: "1.2", level: 200,
      stem: "After a custom network ACL is attached to the application subnets, the application can no longer query its database in another subnet. VPC Flow Logs show the queries to port 3306 ACCEPTED and the responses REJECTED. Security groups are unchanged. What is the fix?",
      options: [
        { t: "Allow inbound TCP 1024–65535 from the database subnets in the application subnets' network ACL", c: true, why: "The NACL is stateless. Database replies arrive at the app's ephemeral ports and need an explicit inbound rule." },
        { t: "Allow inbound TCP 3306 in the application instances' security group", c: false, why: "The app initiates the connection. Its security group already allows replies statefully." },
        { t: "Add an outbound rule to the database security group", c: false, why: "Security groups are stateful. Replies to allowed inbound connections are always permitted." },
        { t: "Add a route to the database subnet in the route table", c: false, why: "Local routes within a VPC exist automatically, and the request already reached the database." }
      ] },
    { id: "M02.06-k3", type: "single", domain: "D1", task: "1.2", level: 200,
      stem: "A company must ensure that EC2 instances in private subnets can reach only <code>api.payments-partner.com</code> and AWS service endpoints on the internet. All other outbound traffic must be blocked and logged. The partner's IP addresses change frequently. Which solution meets these requirements with the LEAST operational overhead?",
      options: [
        { t: "Route outbound traffic through AWS Network Firewall with a stateful domain allow-list rule group", c: true, why: "Network Firewall filters by domain (TLS SNI / HTTP Host) as a managed service, and logs alerts and blocked flows." },
        { t: "Allow only the partner's current IP addresses in the instances' security group outbound rules", c: false, why: "The IPs change frequently, so the rules would break and need constant updates." },
        { t: "Attach AWS WAF to the NAT gateway", c: false, why: "AWS WAF does not attach to NAT gateways. It protects inbound HTTP front doors." },
        { t: "Run a self-managed Squid proxy fleet on EC2 in each AZ", c: false, why: "It works, but patching, scaling and HA for a proxy fleet is far more operational overhead than a managed firewall." }
      ] },
    { id: "M02.06-k4", type: "single", domain: "D2", task: "2.2", level: 200,
      stem: "A company has ordered AWS Direct Connect, which will take 10 weeks. It needs <strong>encrypted</strong> connectivity between its data centre and a VPC within days, and wants a resilient design once Direct Connect arrives. What should a solutions architect recommend?",
      options: [
        { t: "Create a Site-to-Site VPN now, then keep it as a backup path after Direct Connect is in service", c: true, why: "A VPN is quick to set up and encrypted. It then provides a low-cost failover path for DX." },
        { t: "Use AWS Client VPN for all data-centre servers", c: false, why: "Client VPN is for individual user devices, not network-to-network connectivity." },
        { t: "Expose the services publicly over HTTPS until Direct Connect is ready", c: false, why: "That increases the attack surface and doesn't provide private network connectivity." },
        { t: "Wait for Direct Connect, because it is encrypted by default", c: false, why: "It misses the deadline, and DX is not encrypted by default (it needs MACsec or VPN over DX)." }
      ] },
    { id: "M02.06-k5", type: "multi", domain: "D1", task: "1.2", level: 200,
      stem: "A security team wants to remove the bastion host used to administer Linux instances in private subnets. Which TWO benefits does AWS Systems Manager Session Manager provide?",
      options: [
        { t: "No inbound ports (such as TCP 22) need to be open on the instances", c: true, why: "The SSM Agent makes outbound connections to Systems Manager, so no inbound access is needed." },
        { t: "Access is controlled by IAM, and sessions can be logged to S3 or CloudWatch Logs", c: true, why: "IAM policies authorise who can start sessions. Activity is auditable through CloudTrail and session logs." },
        { t: "It encrypts the EBS volumes of managed instances", c: false, why: "EBS encryption is a separate feature, configured with KMS." },
        { t: "It provides a site-to-site IPsec tunnel to on-premises", c: false, why: "That is AWS Site-to-Site VPN." },
        { t: "It automatically blocks SQL injection attempts", c: false, why: "That is AWS WAF." }
      ] },
    { id: "M02.06-k6", type: "single", domain: "D1", task: "1.2", level: 300,
      stem: "A company's security policy requires that all traffic between VPCs and the internet be inspected by the same third-party next-generation firewall product it uses on premises. The solution must scale horizontally and remain highly available. What should a solutions architect use?",
      options: [
        { t: "A Gateway Load Balancer with the vendor's virtual appliances, and Gateway Load Balancer endpoints in the traffic path", c: true, why: "GWLB transparently distributes traffic (GENEVE) to a scalable, health-checked fleet of third-party appliances." },
        { t: "An Application Load Balancer in front of the appliances", c: false, why: "The ALB only proxies HTTP(S) and isn't transparent to arbitrary traffic." },
        { t: "AWS WAF with managed rule groups", c: false, why: "WAF isn't the required third-party product, and it only covers HTTP front doors." },
        { t: "Security groups that mirror the on-premises firewall rules", c: false, why: "Security groups aren't the vendor product, and they can't do L7 or IPS inspection." }
      ] }
  ],
  cards: ["fc-M02-6-01", "fc-M02-6-02", "fc-M02-6-03", "fc-M02-6-04", "fc-M02-6-05", "fc-M02-6-06", "fc-M02-6-07", "fc-M02-6-08", "fc-M02-6-09", "fc-M02-6-10", "fc-M02-6-11", "fc-M02-6-12"],
  references: [
    "<em>System Design on AWS</em> ch.5 \"Networking Components\" (PDF p215) and ch.6 \"Communication Networks &amp; Protocols\" (PDF p247–299)",
    "Amazon VPC User Guide: <em>Security groups</em>, <em>Network ACLs</em> (including ephemeral ports), <em>VPC Flow Logs</em>",
    "AWS Site-to-Site VPN User Guide: <em>Tunnel options</em> and <em>Quotas</em>; AWS Client VPN Administrator Guide",
    "AWS Network Firewall Developer Guide; Elastic Load Balancing: <em>Gateway Load Balancers</em>",
    "AWS WAF, AWS Firewall Manager and AWS Shield Advanced Developer Guide",
    "AWS Systems Manager User Guide: <em>Session Manager</em>",
    "OWASP Top 10 (owasp.org); RFC 7296 (IKEv2), RFC 4303 (ESP)"
  ]
});

FLASHCARDS.push(
  { id: "fc-M02-6-01", front: "Security group vs NACL: four differences?", back: "SG: stateful, allow-only, ENI level, can reference SGs. NACL: stateless, allow + deny, subnet level, ordered rules (first match wins), CIDRs only." },
  { id: "fc-M02-6-02", front: "Why do NACLs need ephemeral port rules?", back: "They are stateless: replies are new packets to the client's ephemeral port, so allow TCP 1024–65535 in the return direction." },
  { id: "fc-M02-6-03", front: "How do you block a single malicious IP on AWS?", back: "NACL deny rule with a low rule number (subnet-wide), or an AWS WAF IP set rule for HTTP traffic. Security groups can't deny." },
  { id: "fc-M02-6-04", front: "IDS vs IPS?", back: "IDS detects and alerts (out of band, e.g. traffic mirroring, GuardDuty). IPS sits inline and drops (Network Firewall Suricata rules, appliances behind GWLB)." },
  { id: "fc-M02-6-05", front: "AWS WAF protects against…? Attaches to…?", back: "L7 HTTP attacks: SQLi, XSS, bad bots, rate abuse, geo/IP lists. Attaches to CloudFront, ALB, API Gateway, AppSync, Cognito user pools (and a few others)." },
  { id: "fc-M02-6-06", front: "Shield Standard vs Shield Advanced?", back: "Standard: free, automatic L3/L4 DDoS protection. Advanced: paid, enhanced detection, 24/7 Shield Response Team, DDoS cost protection, WAF for protected resources." },
  { id: "fc-M02-6-07", front: "IPsec building blocks and ports?", back: "IKE (UDP 500) phase 1 = secure channel, phase 2 = IPsec SAs. ESP (IP protocol 50) encrypts data. NAT-T = UDP 4500. Tunnel mode for site-to-site." },
  { id: "fc-M02-6-08", front: "AWS Site-to-Site VPN key facts?", back: "IPsec, 2 tunnels per connection (configure both), ~1.25 Gbps per tunnel, terminates on VGW (one VPC) or TGW (many VPCs, ECMP), static or BGP routing." },
  { id: "fc-M02-6-09", front: "Is Direct Connect encrypted?", back: "Not by default. Use MACsec (supported dedicated connections) or run Site-to-Site VPN over DX." },
  { id: "fc-M02-6-10", front: "Forward proxy vs reverse proxy?", back: "Forward: acts for clients going out (egress control, domain allow-lists → Network Firewall/Squid). Reverse: acts for servers (TLS, cache, LB, WAF → CloudFront, ALB, API Gateway)." },
  { id: "fc-M02-6-11", front: "Filter outbound traffic by domain name on AWS?", back: "AWS Network Firewall stateful domain list (TLS SNI / HTTP Host), plus Route 53 Resolver DNS Firewall for DNS lookups." },
  { id: "fc-M02-6-12", front: "Gateway Load Balancer: what and how?", back: "Inserts third-party virtual appliances (firewalls, IPS) transparently and scalably. Uses GENEVE on UDP 6081, reached through GWLB endpoints in route tables." }
);

  // ================================================================== 90_lab_quiz.js
/* ================================================================== LAB L02 */
var DG_L02_PLAN = `
<figure>
<svg class="diagram" viewBox="0 0 760 330" role="img" aria-labelledby="l02pt l02pd">
  <title id="l02pt">Subnet plan for VPC 10.20.0.0/16 across three Availability Zones</title>
  <desc id="l02pd">Each of three AZs gets a public /24, a private application /20 and a data /24. Large blocks remain spare for growth.</desc>
  <rect class="dg-region" x="10" y="10" width="740" height="310" rx="14"/>
  <text class="dg-ta" x="24" y="34">VPC 10.20.0.0/16 · 65,536 addresses</text>

  <rect class="dg-az" x="24" y="46" width="230" height="196" rx="10"/>
  <text class="dg-tb" x="36" y="68">AZ a</text>
  <rect class="dg-edge" x="36" y="78" width="206" height="44" rx="6"/>
  <text class="dg-t" x="46" y="96">Public  10.20.0.0/24</text><text class="dg-ts" x="46" y="113">251 usable · ALB, NAT gateway</text>
  <rect class="dg-info" x="36" y="130" width="206" height="54" rx="6"/>
  <text class="dg-t" x="46" y="150">App  10.20.16.0/20</text><text class="dg-ts" x="46" y="168">4,091 usable · EC2, containers</text>
  <rect class="dg-good" x="36" y="192" width="206" height="40" rx="6"/>
  <text class="dg-t" x="46" y="210">Data  10.20.64.0/24</text><text class="dg-ts" x="46" y="225">RDS, ElastiCache</text>

  <rect class="dg-az" x="265" y="46" width="230" height="196" rx="10"/>
  <text class="dg-tb" x="277" y="68">AZ b</text>
  <rect class="dg-edge" x="277" y="78" width="206" height="44" rx="6"/>
  <text class="dg-t" x="287" y="96">Public  10.20.1.0/24</text><text class="dg-ts" x="287" y="113">251 usable</text>
  <rect class="dg-info" x="277" y="130" width="206" height="54" rx="6"/>
  <text class="dg-t" x="287" y="150">App  10.20.32.0/20</text><text class="dg-ts" x="287" y="168">4,091 usable</text>
  <rect class="dg-good" x="277" y="192" width="206" height="40" rx="6"/>
  <text class="dg-t" x="287" y="210">Data  10.20.65.0/24</text><text class="dg-ts" x="287" y="225">251 usable</text>

  <rect class="dg-az" x="506" y="46" width="230" height="196" rx="10"/>
  <text class="dg-tb" x="518" y="68">AZ c</text>
  <rect class="dg-edge" x="518" y="78" width="206" height="44" rx="6"/>
  <text class="dg-t" x="528" y="96">Public  10.20.2.0/24</text><text class="dg-ts" x="528" y="113">251 usable</text>
  <rect class="dg-info" x="518" y="130" width="206" height="54" rx="6"/>
  <text class="dg-t" x="528" y="150">App  10.20.48.0/20</text><text class="dg-ts" x="528" y="168">4,091 usable</text>
  <rect class="dg-good" x="518" y="192" width="206" height="40" rx="6"/>
  <text class="dg-t" x="528" y="210">Data  10.20.66.0/24</text><text class="dg-ts" x="528" y="225">251 usable</text>

  <rect class="dg-box" x="24" y="254" width="712" height="56" rx="8"/>
  <text class="dg-tb" x="36" y="276">Spare for growth</text>
  <text class="dg-ts" x="36" y="296">10.20.3.0–10.20.15.255 (13 × /24) · 10.20.67.0–10.20.127.255 · 10.20.128.0/17 (a 4th AZ, endpoints, new tiers)</text>
</svg>
<figcaption>Figure L02-1. The subnet plan you design in step 9 and, optionally, build in step 10.</figcaption>
</figure>`;

var LAB_L02 = {
  id: "L02", title: "Networking toolkit: CIDR planning, dig, curl, traceroute", level: 200, duration: "90–120 min",
  cost: "$0 (local machine / CloudShell; optional VPC is free)",
  objective: `
<p>Build the hands-on reflexes that every architect uses when a design meets reality. In this lab you work through each layer, from the bottom up:</p>
<ul>
  <li><strong>Addressing:</strong> read your own IP configuration, explain where NAT happens, and do CIDR maths with tools and by hand.</li>
  <li><strong>Naming:</strong> query DNS like a resolver does, watch TTLs count down, and follow a delegation from the root.</li>
  <li><strong>Transport and application:</strong> measure where an HTTPS request spends its time (DNS, TCP, TLS, server), and inspect a real certificate chain.</li>
  <li><strong>Path:</strong> trace the routers between you and a host, and test whether ports are reachable.</li>
  <li><strong>Design:</strong> plan a production 3-AZ VPC address space and, optionally, create it in AWS for free.</li>
</ul>
<p>When things break in production ("the app can't reach the database", "DNS has not updated", "TLS handshake failed"), these are the exact commands you will use.</p>`,
  warning: `⚠️ Run these tools only against your own resources or public sites in normal ways (a handful of queries). Do not scan networks you don't own. Port-scanning third-party hosts can breach acceptable-use policies. Step 10 creates AWS resources; VPCs and subnets are free, but <strong>do not</strong> add NAT gateways or other paid resources, and run the clean-up afterwards.`,
  diagram: DG_L02_PLAN,
  steps: [
    { id: "s1", title: "Set up your toolkit", html: `
<p>Use <strong>WSL (Ubuntu)</strong>, any Linux machine, or <strong>AWS CloudShell</strong> (browser shell in the console, free, already authenticated, Amazon Linux 2023).</p>
<pre><code># Ubuntu / Debian / WSL
sudo apt-get update
sudo apt-get install -y dnsutils curl traceroute iputils-tracepath mtr-tiny netcat-openbsd openssl ipcalc python3 iproute2

# Amazon Linux 2023 / CloudShell / Fedora
sudo dnf install -y bind-utils traceroute mtr nmap-ncat openssl python3 iproute

# Confirm
dig -v; curl --version | head -1; openssl version; python3 --version</code></pre>
<table>
<thead><tr><th>Tool</th><th>Layer</th><th>Question it answers</th></tr></thead>
<tbody>
<tr><td><code>ip</code></td><td>L2/L3</td><td>What are my addresses, routes and default gateway?</td></tr>
<tr><td><code>dig</code></td><td>L7 (DNS)</td><td>What does this name resolve to, from whose point of view, and for how long?</td></tr>
<tr><td><code>curl</code></td><td>L7 (HTTP)</td><td>What did the server answer, and where did the time go?</td></tr>
<tr><td><code>openssl s_client</code></td><td>L5/6 (TLS)</td><td>Which certificate is served, who issued it, when does it expire?</td></tr>
<tr><td><code>traceroute</code> / <code>mtr</code></td><td>L3</td><td>Which routers does my packet cross, and where is the loss or latency?</td></tr>
<tr><td><code>nc</code>, <code>ss</code></td><td>L4</td><td>Is this TCP port open? Which connections and ephemeral ports exist?</td></tr>
</tbody></table>
<p class="muted small">CloudShell note: CloudShell runs in an AWS-managed network, so step 2 shows a CloudShell address rather than your home network. Doing step 2 in both places is a good comparison.</p>` },

    { id: "s2", title: "Inspect your own network and find the NAT", html: `
<pre><code>ip -4 addr show        # your interfaces and IPv4 addresses with prefix length
ip route               # your routing table
curl -s https://checkip.amazonaws.com    # the public IP the internet sees</code></pre>
<p>Sample output (WSL2 on a home network):</p>
<pre><code>2: eth0: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 ...
    inet 172.24.118.40/20 brd 172.24.127.255 scope global eth0

default via 172.24.112.1 dev eth0
172.24.112.0/20 dev eth0 proto kernel scope link src 172.24.118.40

203.0.113.57</code></pre>
<p><strong>Read it like an architect:</strong></p>
<ol>
  <li><strong>Private IP and prefix:</strong> <code>172.24.118.40/20</code>. 172.16.0.0/12 is an RFC 1918 private range, so this address is not routable on the internet.</li>
  <li><strong>Local network (connected route):</strong> <code>172.24.112.0/20</code>. Any destination inside it is reached directly, with no router needed.</li>
  <li><strong>Default route:</strong> <code>default via 172.24.112.1</code> (equivalent to <code>0.0.0.0/0</code>). Every other destination goes to the gateway. This is exactly what a VPC route table entry <code>0.0.0.0/0 → igw-…</code> or <code>→ nat-…</code> does.</li>
  <li><strong>Public IP ≠ private IP:</strong> at least one NAT device (WSL's virtual switch, then your home router, possibly your ISP's carrier-grade NAT) rewrites your source address. That is exactly why a <strong>NAT gateway</strong> lets private-subnet instances reach the internet without being reachable from it.</li>
</ol>
<div class="callout tip">Write down: private IP, prefix, network address, default gateway, public IP, and how many NAT layers you think there are. You will reuse this reasoning in M09 (VPC) when you diagnose "instance has no internet access".</div>` },

    { id: "s3", title: "CIDR maths with Python and ipcalc", html: `
<p>Always check your hand calculations with a tool before you commit an address plan. Overlapping CIDRs are one of the few VPC mistakes you cannot fix without rebuilding.</p>
<pre><code>python3 - &lt;&lt;'PY'
import ipaddress as ip
net = ip.ip_network("10.20.16.0/20")
print("addresses:", net.num_addresses)                 # 4096
print("AWS usable:", net.num_addresses - 5)            # 4091 (AWS reserves 5 per subnet)
print("netmask:", net.netmask)                         # 255.255.240.0
print("first/last:", net[0], net[-1])                  # 10.20.16.0 10.20.31.255
print("AWS reserved:", [str(net[i]) for i in (0,1,2,3)], str(net[-1]))
print("which /20 holds 10.20.37.9?", ip.ip_interface("10.20.37.9/20").network)   # 10.20.32.0/20
print("overlap?", net.overlaps(ip.ip_network("10.20.24.0/21")))                   # True
print("split into /22:", [str(s) for s in net.subnets(new_prefix=22)])
print("summarise:", list(ip.collapse_addresses([ip.ip_network("10.0.0.0/24"), ip.ip_network("10.0.1.0/24")])))
PY

ipcalc 10.20.37.9/20</code></pre>
<p>Sample <code>ipcalc</code> output (Ubuntu):</p>
<pre><code>Address:   10.20.37.9           00001010.00010100.0010 0101.00001001
Netmask:   255.255.240.0 = 20   11111111.11111111.1111 0000.00000000
Network:   10.20.32.0/20        00001010.00010100.0010 0000.00000000
HostMin:   10.20.32.1
HostMax:   10.20.47.254
Broadcast: 10.20.47.255
Hosts/Net: 4094                 Class A, Private Internet</code></pre>
<div class="callout warn"><strong>ipcalc vs AWS:</strong> ipcalc's <em>Hosts/Net 4094</em> subtracts only the network and broadcast addresses. AWS reserves <strong>five</strong>: the network address, <code>.1</code> (VPC router), <code>.2</code> (Amazon DNS), <code>.3</code> (reserved for future use) and the last address. So the exam answer is 4,096 − 5 = <strong>4,091</strong>.</div>
<p>The space in ipcalc's binary column marks the prefix boundary. The bits to the left are fixed (network part), the bits to the right vary (host part). Practise finding the network address in your head with the <em>block size</em> method: for /20 the third octet moves in blocks of 2<sup>(24−20)</sup> = 16, so 37 falls in the 32–47 block → <code>10.20.32.0</code>.</p>
<p>Now complete the <strong>CIDR worksheet</strong> below this step list (it is auto-graded) before moving on.</p>` },

    { id: "s4", title: "DNS with dig: records, TTLs, delegation, resolvers", html: `
<pre><code># 1. The basics: one name, several record types
dig aws.amazon.com A +noall +answer
dig www.amazon.com +noall +answer          # watch for a CNAME chain
dig amazon.com MX +short
dig amazon.com TXT +short                  # SPF, domain-verification tokens
dig amazon.com NS +short                   # who is authoritative
dig amazon.com SOA +short                  # serial, refresh, retry, expire, negative-cache TTL
dig aws.amazon.com AAAA +short             # IPv6

# 2. TTL countdown: run twice, ~10 s apart, against the same caching resolver
dig www.amazon.com +noall +answer @1.1.1.1
sleep 10; dig www.amazon.com +noall +answer @1.1.1.1

# 3. Compare resolvers (cached answers and geo/latency-based answers can differ)
dig www.amazon.com +short @8.8.8.8
dig www.amazon.com +short @1.1.1.1

# 4. Walk the delegation from the root, as a recursive resolver does
dig aws.amazon.com +trace

# 5. Reverse DNS (PTR)
dig -x 8.8.8.8 +short</code></pre>
<p>Sample output for the CNAME chain (your values will differ):</p>
<pre><code>www.amazon.com.          1800  IN  CNAME  tp.47cf2c8c9-frontier.amazon.com.
tp.47cf2c8c9-frontier.amazon.com. 60 IN CNAME www.amazon.com.edgekey.net.
www.amazon.com.edgekey.net. 60 IN  CNAME  e15316.a.akamaiedge.net.
e15316.a.akamaiedge.net.   20  IN  A      23.45.67.89</code></pre>
<p><strong>What to notice:</strong></p>
<ul>
  <li>The second column is the <strong>TTL in seconds</strong>. On a repeat query to the same resolver it is <em>lower</em>: you are seeing the resolver's cached copy ageing. When it reaches 0 the resolver asks the authoritative servers again. This is why DNS changes are not instant, and why you <strong>lower the TTL before a migration</strong>, not at the moment of cut-over.</li>
  <li>A <strong>CNAME</strong> maps one name to another name, never to an IP. A name with a CNAME cannot have other records, which is why a CNAME is not allowed at the zone apex (<code>example.com</code>). Route 53 <strong>alias</strong> records solve that.</li>
  <li><code>+trace</code> shows the hierarchy: root (<code>.</code>) servers → <code>com.</code> TLD servers → the domain's authoritative servers (for many AWS-hosted domains these are <code>ns-xxx.awsdns-xx.com/.net/.org/.co.uk</code>, i.e. <strong>Route 53</strong>).</li>
  <li><code>status: NXDOMAIN</code> in the header means the name does not exist. <code>NOERROR</code> with an empty answer section means the name exists but has no record of that type.</li>
</ul>` },

    { id: "s5", title: "HTTP with curl: headers, redirects, HTTP/2 and a timing breakdown", html: `
<pre><code># Headers only (HEAD request)
curl -sI https://aws.amazon.com

# Full conversation: DNS answer, TCP connect, TLS handshake, request and response headers
curl -sv -o /dev/null https://aws.amazon.com 2&gt;&amp;1 | grep -E '^(\\*|&gt;|&lt;)' | head -40

# Follow redirects (http → https, apex → www)
curl -sIL http://amazon.com | grep -iE '^(HTTP|location)'

# Force HTTP/1.1 vs HTTP/2 and compare the protocol line
curl -sI --http1.1 https://aws.amazon.com | head -1
curl -sI --http2   https://aws.amazon.com | head -1

# Where does the time go? (seconds, cumulative from the start)
curl -s -o /dev/null https://aws.amazon.com -w '
 dns lookup:  %{time_namelookup}
 tcp connect: %{time_connect}
 tls done:    %{time_appconnect}
 first byte:  %{time_starttransfer}
 total:       %{time_total}
 http:        %{http_code}  version: %{http_version}  remote: %{remote_ip}:%{remote_port}\\n'</code></pre>
<p>Sample timing output:</p>
<pre><code> dns lookup:  0.012
 tcp connect: 0.031
 tls done:    0.078
 first byte:  0.142
 total:       0.164
 http:        200  version: 2  remote: 18.66.122.45:443</code></pre>
<p><strong>Interpret the waterfall</strong> (each value is cumulative):</p>
<table>
<thead><tr><th>Phase</th><th>Calculation</th><th>Sample</th><th>If it's slow, look at…</th></tr></thead>
<tbody>
<tr><td>DNS</td><td>namelookup</td><td>12 ms</td><td>Resolver distance, TTL too low, missing cache</td></tr>
<tr><td>TCP handshake</td><td>connect − namelookup</td><td>19 ms ≈ 1 RTT</td><td>Distance to server. Fix with CloudFront or Global Accelerator edge locations.</td></tr>
<tr><td>TLS handshake</td><td>appconnect − connect</td><td>47 ms</td><td>TLS 1.2 needs 2 RTTs, TLS 1.3 needs 1. Terminating TLS at the edge shortens it.</td></tr>
<tr><td>Server time (TTFB)</td><td>starttransfer − appconnect</td><td>64 ms</td><td>Application, database, cache misses</td></tr>
<tr><td>Download</td><td>total − starttransfer</td><td>22 ms</td><td>Payload size, compression, bandwidth</td></tr>
</tbody></table>
<p>Run the same timing against a site far from you and against one near you. The TCP connect time is roughly one round-trip time (RTT). This is the number edge services reduce.</p>` },

    { id: "s6", title: "TLS with openssl: the certificate chain and expiry", html: `
<pre><code># Show the chain the server sends (SNI matters: -servername)
openssl s_client -connect aws.amazon.com:443 -servername aws.amazon.com -showcerts &lt;/dev/null 2&gt;/dev/null \\
  | grep -E 's:|i:|Protocol|Cipher'

# Leaf certificate details: subject, issuer, validity and SANs
echo | openssl s_client -connect aws.amazon.com:443 -servername aws.amazon.com 2&gt;/dev/null \\
  | openssl x509 -noout -subject -issuer -dates -ext subjectAltName

# Which TLS versions does it accept?
openssl s_client -connect aws.amazon.com:443 -servername aws.amazon.com -tls1_3 &lt;/dev/null 2&gt;/dev/null | grep -E 'Protocol|Cipher'</code></pre>
<p>Sample output:</p>
<pre><code> 0 s:CN = aws.amazon.com
   i:C = US, O = Amazon, CN = Amazon RSA 2048 M01
 1 s:C = US, O = Amazon, CN = Amazon RSA 2048 M01
   i:C = US, O = Amazon, CN = Amazon Root CA 1
subject=CN = aws.amazon.com
issuer=C = US, O = Amazon, CN = Amazon RSA 2048 M01
notBefore=Jan 12 00:00:00 2026 GMT
notAfter=Dec 10 23:59:59 2026 GMT
X509v3 Subject Alternative Name:
    DNS:aws.amazon.com, DNS:*.aws.amazon.com, ...
New, TLSv1.3, Cipher is TLS_AES_128_GCM_SHA256</code></pre>
<ul>
  <li><strong>Chain of trust:</strong> leaf (<code>0 s:</code>) is signed by an intermediate (<code>i:</code>), which is signed by a root CA that your OS trusts. A server that forgets to send its intermediate causes "unable to verify" errors for some clients. That's a classic misconfiguration when people install certificates manually.</li>
  <li><strong>SAN:</strong> the names the certificate is valid for. A certificate for <code>*.example.com</code> does <em>not</em> cover the apex <code>example.com</code>. Request both names (ACM lets you add several).</li>
  <li><strong>notAfter:</strong> expiry. Expired certificates are a top cause of outages. <strong>ACM public certificates renew automatically</strong> when used with integrated services (ALB, CloudFront, API Gateway). Certificates you import into ACM do not.</li>
  <li><strong>SNI</strong> (<code>-servername</code>): lets one IP serve many certificates. ALB and CloudFront use SNI to pick the right certificate per hostname.</li>
</ul>` },

    { id: "s7", title: "Trace the path: traceroute, tracepath and mtr", html: `
<pre><code>traceroute -n aws.amazon.com          # UDP probes by default on Linux
sudo traceroute -n -T -p 443 aws.amazon.com   # TCP SYN probes to 443: get through more firewalls
tracepath -n aws.amazon.com            # no root needed; also reports path MTU
mtr -rwn -c 20 aws.amazon.com          # 20 rounds, report mode: loss and latency per hop</code></pre>
<p>Sample (trimmed):</p>
<pre><code> 1  172.24.112.1     0.4 ms     ← WSL virtual switch (first NAT)
 2  192.168.1.1      2.1 ms     ← home router (second NAT)
 3  100.64.0.1       9.8 ms     ← ISP carrier-grade NAT (100.64.0.0/10 shared space)
 4  * * *                       ← router that doesn't answer probes: normal
 5  52.93.x.x       14.2 ms     ← entering the AWS network
 ...
 9  18.66.122.45    15.0 ms     ← CloudFront edge</code></pre>
<p><strong>How it works:</strong> traceroute sends packets with TTL = 1, 2, 3… Each router decrements the TTL. The one that hits 0 drops the packet and returns an ICMP "time exceeded" message, which reveals its address. <strong>How to read it:</strong></p>
<ul>
  <li><code>* * *</code> on a middle hop while later hops answer: that router simply rate-limits or drops ICMP. It is <strong>not</strong> packet loss.</li>
  <li>Loss that starts at hop N and <em>continues to the destination</em> in <code>mtr</code> points to a real problem at or after hop N.</li>
  <li>A big latency jump between two hops usually means a long physical distance (for example, crossing an ocean).</li>
  <li>Inside a VPC, traceroute between instances shows very few hops: the VPC router is not a visible hop. If you need path analysis in AWS, use <strong>VPC Reachability Analyzer</strong> (configuration analysis, no packets sent) and <strong>VPC Flow Logs</strong> (accepted/rejected records).</li>
</ul>` },

    { id: "s8", title: "Ports and connections: nc and ss", html: `
<pre><code># TCP: does the three-way handshake complete?
nc -vz -w 3 aws.amazon.com 443        # succeeded / open
nc -vz -w 3 aws.amazon.com 25         # likely times out (filtered)
nc -vz -w 3 127.0.0.1 9               # "Connection refused" (host reachable, nothing listening)

# UDP: there is no handshake, so "open" cannot be proven this way
nc -vzu -w 3 1.1.1.1 53               # prints success even though nothing was confirmed
dig @1.1.1.1 example.com +short       # the real UDP test: an application-level reply

# See your own connections and ephemeral source ports
curl -s -o /dev/null https://aws.amazon.com &amp;  sleep 0.3; ss -tn state established '( dport = :443 )'</code></pre>
<p>Sample <code>ss</code> output:</p>
<pre><code>Recv-Q Send-Q   Local Address:Port      Peer Address:Port
0      0        172.24.118.40:51344     18.66.122.45:443</code></pre>
<table>
<thead><tr><th>Result</th><th>Meaning</th><th>Typical AWS cause</th></tr></thead>
<tbody>
<tr><td><strong>succeeded / open</strong></td><td>SYN → SYN-ACK → ACK completed</td><td>Path, security group, NACL and listener all OK</td></tr>
<tr><td><strong>Connection refused</strong> (fast)</td><td>Host replied with RST: reachable, but nothing listening on that port</td><td>App not running, or listening on 127.0.0.1 only. The network is fine.</td></tr>
<tr><td><strong>Timed out</strong> (slow)</td><td>Packets silently dropped</td><td>Security group or NACL blocks it, a route is missing, or no IGW/NAT</td></tr>
</tbody></table>
<p>The local port <code>51344</code> is an <strong>ephemeral port</strong> chosen by your OS (Linux default range 32768–60999). Return traffic comes back <em>to that port</em>. That is why a stateless <strong>NACL</strong> needs an inbound rule for ephemeral ports (1024–65535 covers all common OSes and the NAT gateway), while a stateful <strong>security group</strong> allows the return traffic automatically.</p>` },

    { id: "s9", title: "Design exercise: a 3-AZ subnet plan for 10.20.0.0/16", html: `
<p>Requirements: three AZs. Each AZ needs a <strong>public</strong> subnet (load balancers, NAT gateways: few IPs), a <strong>private app</strong> subnet (EC2 Auto Scaling and containers, where each task or pod may consume an IP: needs lots), and a <strong>data</strong> subnet (RDS, ElastiCache: few IPs). Keep large spare space for a fourth AZ, VPC endpoints and future tiers. The plan must not overlap with on-premises <code>10.0.0.0/14</code> or the other VPCs <code>10.10.0.0/16</code> and <code>10.30.0.0/16</code>.</p>
<p>Fill in the table yourself first, then compare with the reference solution:</p>
<table>
<thead><tr><th>Tier</th><th>AZ a</th><th>AZ b</th><th>AZ c</th><th>Size (AWS usable each)</th></tr></thead>
<tbody>
<tr><td>Public</td><td>10.20.0.0/24</td><td>10.20.1.0/24</td><td>10.20.2.0/24</td><td>/24 (251)</td></tr>
<tr><td>Private app</td><td>10.20.16.0/20</td><td>10.20.32.0/20</td><td>10.20.48.0/20</td><td>/20 (4,091)</td></tr>
<tr><td>Data</td><td>10.20.64.0/24</td><td>10.20.65.0/24</td><td>10.20.66.0/24</td><td>/24 (251)</td></tr>
<tr><td>Spare</td><td colspan="4">10.20.3.0–10.20.15.255 (13 × /24) · 10.20.67.0–10.20.127.255 · 10.20.128.0/17 (32,768 addresses)</td></tr>
</tbody></table>
<p><strong>Design reasoning:</strong></p>
<ul>
  <li><strong>Why /20 for the app tier?</strong> Containers on Amazon EKS (VPC CNI) and Amazon ECS (awsvpc mode) give every pod or task its own VPC IP, so a /24 runs out quickly. A subnet cannot be resized, so size for growth.</li>
  <li><strong>Why align /20s on multiples of 16 in the third octet?</strong> A /20 must start on a 16-boundary (0, 16, 32, 48…). <code>10.20.8.0/20</code> is invalid; Python would raise "has host bits set".</li>
  <li><strong>Why keep the public subnets together at the bottom?</strong> Contiguous blocks are easy to summarise: <code>10.20.0.0/22</code> covers all public subnets (plus one spare /24), which keeps NACL and firewall rules short.</li>
  <li><strong>Why 10.20.0.0/16 at all?</strong> Each VPC gets a unique, non-overlapping /16 from a company-wide plan (an IPAM, ideally <strong>Amazon VPC IPAM</strong>). Overlapping CIDRs block VPC peering, Transit Gateway routing and VPN routing later.</li>
</ul>
<p>Check your plan for overlaps with Python:</p>
<pre><code>python3 - &lt;&lt;'PY'
import ipaddress as ip, itertools
plan = ["10.20.0.0/24","10.20.1.0/24","10.20.2.0/24","10.20.16.0/20","10.20.32.0/20","10.20.48.0/20",
        "10.20.64.0/24","10.20.65.0/24","10.20.66.0/24"]
nets = [ip.ip_network(p) for p in plan]
vpc = ip.ip_network("10.20.0.0/16")
assert all(n.subnet_of(vpc) for n in nets), "subnet outside VPC"
bad = [(str(a),str(b)) for a,b in itertools.combinations(nets,2) if a.overlaps(b)]
print("overlaps:", bad or "none")
for other in ["10.0.0.0/14","10.10.0.0/16","10.30.0.0/16"]:
    print(other, "overlaps VPC?", vpc.overlaps(ip.ip_network(other)))
print("total AWS-usable:", sum(n.num_addresses-5 for n in nets))
PY</code></pre>
<p>Expected: <code>overlaps: none</code>, all three <code>False</code>, total AWS-usable <code>13779</code>. Save your plan; you will reuse it in M09.</p>` },

    { id: "s10", title: "Optional (free): build the plan in a real VPC with the CLI", html: `
<p>VPCs, subnets and route tables cost nothing. Use your <code>academy-admin</code> profile from Lab L01. Don't create NAT gateways here; they are billed hourly.</p>
<pre><code>export AWS_PROFILE=academy-admin AWS_REGION=eu-west-1    # choose your Region
AZS=($(aws ec2 describe-availability-zones --query "AvailabilityZones[?ZoneType=='availability-zone'].ZoneName" --output text))
echo "Using AZs: \${AZS[0]} \${AZS[1]} \${AZS[2]}"

VPC=$(aws ec2 create-vpc --cidr-block 10.20.0.0/16 \\
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=lab-l02},{Key=lab,Value=L02}]' \\
  --query Vpc.VpcId --output text)
echo $VPC

mk() {  # name cidr az-index
  aws ec2 create-subnet --vpc-id "$VPC" --cidr-block "$2" --availability-zone "\${AZS[$3]}" \\
    --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=$1},{Key=lab,Value=L02}]" \\
    --query Subnet.SubnetId --output text
}
mk public-a 10.20.0.0/24 0;  mk public-b 10.20.1.0/24 1;  mk public-c 10.20.2.0/24 2
mk app-a 10.20.16.0/20 0;    mk app-b 10.20.32.0/20 1;    mk app-c 10.20.48.0/20 2
mk data-a 10.20.64.0/24 0;   mk data-b 10.20.65.0/24 1;   mk data-c 10.20.66.0/24 2

# Try a mistake on purpose: an overlapping subnet
mk oops 10.20.20.0/24 0     # expect: InvalidSubnet.Conflict</code></pre>
<p class="muted small">If you paste this into a shell, type the <code>\${…}</code> expressions exactly as shown (bash arrays). CloudShell already has the CLI configured: there you can drop <code>AWS_PROFILE</code>.</p>
<p>Then list the subnets and check AWS's own arithmetic:</p>
<pre><code>aws ec2 describe-subnets --filters Name=vpc-id,Values=$VPC \\
  --query "sort_by(Subnets,&amp;CidrBlock)[].{Name:Tags[?Key=='Name']|[0].Value,CIDR:CidrBlock,AZ:AvailabilityZone,Free:AvailableIpAddressCount}" \\
  --output table</code></pre>
<pre><code>|  AZ          |  CIDR            | Free | Name     |
|  eu-west-1a  |  10.20.0.0/24    |  251 | public-a |
|  eu-west-1b  |  10.20.1.0/24    |  251 | public-b |
|  ...         |                  |      |          |
|  eu-west-1a  |  10.20.16.0/20   | 4091 | app-a    |</code></pre>
<p><code>Free</code> = 2<sup>(32−n)</sup> − 5 for an empty subnet. That is the five AWS-reserved addresses in practice. Look at the VPC's <strong>main route table</strong> too: it contains only the <code>local</code> route (<code>10.20.0.0/16 → local</code>). No subnet is "public" until you attach an internet gateway and add a <code>0.0.0.0/0 → igw</code> route (M09).</p>` }
  ],

  drillsTitle: "CIDR worksheet (auto-graded)",
  drills: [
    { id: "L02-d01", q: "How many IPv4 addresses are in a <code>/24</code>?", answers: ["256"], hint: "2<sup>(32 − prefix)</sup>", explain: "2<sup>8</sup> = 256." },
    { id: "L02-d02", q: "How many addresses in a <code>/24</code> subnet can you assign to resources in <strong>AWS</strong>?", answers: ["251"], hint: "AWS reserves 5 per subnet.", explain: "256 − 5 = 251 (network, .1 VPC router, .2 DNS, .3 reserved, broadcast)." },
    { id: "L02-d03", q: "How many AWS-usable addresses are in a <code>/28</code>, the smallest subnet AWS allows?", answers: ["11"], explain: "16 − 5 = 11." },
    { id: "L02-d04", q: "How many AWS-usable addresses are in a <code>/20</code>?", answers: ["4091"], explain: "2<sup>12</sup> = 4,096 − 5 = 4,091." },
    { id: "L02-d05", q: "What is the dotted-decimal subnet mask for <code>/21</code>?", answers: ["255.255.248.0"], hint: "21 = 8 + 8 + 5 ones; 11111000 = ?", explain: "Third octet 11111000 = 248 → 255.255.248.0." },
    { id: "L02-d06", q: "Mask <code>255.255.255.192</code> is which prefix length? (answer like <code>/26</code>)", answers: ["/26", "26"], explain: "192 = 11000000 → 24 + 2 = 26." },
    { id: "L02-d07", q: "In AWS subnet <code>10.0.1.0/24</code>, what is the <strong>first</strong> IP you can assign to an instance?", answers: ["10.0.1.4"], explain: ".0 network, .1 VPC router, .2 Amazon DNS, .3 reserved → the first assignable address is .4." },
    { id: "L02-d08", q: "In AWS subnet <code>10.0.1.0/24</code>, what is the <strong>last</strong> IP you can assign?", answers: ["10.0.1.254"], explain: ".255 is the broadcast address (reserved by AWS even though VPCs don't use broadcast), so .254 is the last." },
    { id: "L02-d09", q: "What is the VPC router address of subnet <code>10.20.32.0/20</code>?", answers: ["10.20.32.1"], explain: "Network address + 1." },
    { id: "L02-d10", q: "Host <code>10.0.37.77/20</code>: what is its <strong>network address</strong> (with prefix)?", answers: ["10.0.32.0/20"], hint: "/20 → the third octet moves in blocks of 16.", explain: "37 falls in the 32–47 block → 10.0.32.0/20." },
    { id: "L02-d11", q: "Host <code>10.0.37.77/20</code>: what is its <strong>broadcast</strong> (last) address?", answers: ["10.0.47.255"], explain: "Block 32–47, so the last address is 10.0.47.255." },
    { id: "L02-d12", q: "Is <code>172.16.40.5</code> inside <code>172.16.32.0/21</code>? (yes/no)", answers: ["no", "n"], hint: "/21 → third octet blocks of 8.", explain: "172.16.32.0/21 covers 172.16.32.0–172.16.39.255; 40 is outside." },
    { id: "L02-d13", q: "Is <code>192.168.1.130</code> inside <code>192.168.1.128/25</code>? (yes/no)", answers: ["yes", "y"], explain: "/25 covers .128–.255." },
    { id: "L02-d14", q: "Is <code>172.32.0.1</code> an RFC 1918 private address? (yes/no)", answers: ["no", "n"], hint: "The 172 private block is 172.16.0.0/12.", explain: "172.16.0.0/12 spans 172.16.0.0–172.31.255.255. 172.32.x.x is public." },
    { id: "L02-d15", q: "Do <code>10.0.0.0/16</code> and <code>10.0.128.0/17</code> overlap? (yes/no)", answers: ["yes", "y"], explain: "10.0.128.0/17 (10.0.128.0–10.0.255.255) is inside 10.0.0.0/16. You could not peer two VPCs with these CIDRs." },
    { id: "L02-d16", q: "Do <code>10.1.0.0/16</code> and <code>10.0.0.0/16</code> overlap? (yes/no)", answers: ["no", "n"], explain: "Different second octet: 10.0.x.x vs 10.1.x.x." },
    { id: "L02-d17", q: "How many <code>/24</code> subnets fit in a <code>/20</code>?", answers: ["16"], explain: "2<sup>(24−20)</sup> = 16." },
    { id: "L02-d18", q: "How many <code>/26</code> subnets fit in a <code>/23</code>?", answers: ["8"], explain: "2<sup>(26−23)</sup> = 8." },
    { id: "L02-d19", q: "What is the next <code>/20</code> after <code>10.0.16.0/20</code>?", answers: ["10.0.32.0/20"], explain: "Add 4,096 addresses = 16 in the third octet." },
    { id: "L02-d20", q: "What is the next <code>/26</code> after <code>10.0.0.192/26</code>?", answers: ["10.0.1.0/26"], explain: ".192 + 64 = 256, which carries into the third octet → 10.0.1.0/26." },
    { id: "L02-d21", q: "What is the smallest subnet prefix that gives at least <strong>500</strong> assignable IPs in AWS? (e.g. <code>/23</code>)", answers: ["/23", "23"], explain: "/23 = 512 − 5 = 507 ≥ 500. /24 = 251 is too small." },
    { id: "L02-d22", q: "What is the smallest AWS subnet prefix for at least <strong>2,044</strong> assignable IPs?", answers: ["/20", "20"], hint: "Check /21 carefully, remembering the 5 reserved addresses.", explain: "/21 = 2,048 − 5 = 2,043, one short! /20 = 4,091. This is why you never size subnets to the exact requirement." },
    { id: "L02-d23", q: "Summarise <code>10.0.0.0/24</code> and <code>10.0.1.0/24</code> into one CIDR.", answers: ["10.0.0.0/23"], explain: "Two adjacent /24s on an even boundary form a /23." },
    { id: "L02-d24", q: "Summarise <code>192.168.4.0/24</code> through <code>192.168.7.0/24</code> (four networks) into one CIDR.", answers: ["192.168.4.0/22"], hint: "Four /24s = one /22, starting on a multiple of 4.", explain: "4–7 is an aligned block of 4 → 192.168.4.0/22. One route table entry replaces four." },
    { id: "L02-d25", q: "IPv6: a VPC gets a <code>/56</code>. How many <code>/64</code> subnets can it have?", answers: ["256"], explain: "2<sup>(64−56)</sup> = 256. In AWS, an IPv6 subnet in a VPC is typically a /64." }
  ],

  validate: `
<p>You are done when every item below is true:</p>
<ol>
  <li><strong>CIDR worksheet:</strong> all 25 items show <span class="good-text">Correct ✓</span> without revealing more than three answers.</li>
  <li><strong>Network notes</strong> (step 2): you can state your private IP/prefix, default gateway, public IP, and point to where NAT happens.</li>
  <li><strong>DNS</strong> (step 4): you saw a TTL decrease between two queries to the same resolver, and <code>dig +trace</code> reached the authoritative servers.</li>
  <li><strong>HTTP</strong> (step 5): you can split one <code>curl -w</code> result into DNS / TCP / TLS / server / download times.</li>
  <li><strong>TLS</strong> (step 6): you can name the leaf certificate's issuer and its expiry date.</li>
  <li><strong>Ports</strong> (step 8): you produced one "succeeded", one "refused" and one "timed out", and can explain the difference.</li>
  <li><strong>Plan</strong> (step 9): the Python check prints <code>overlaps: none</code> and <code>total AWS-usable: 13779</code>.</li>
</ol>
<p>Optional step 10 checks:</p>
<pre><code># 9 subnets, 3 per AZ, Free = 251 or 4091
aws ec2 describe-subnets --filters Name=tag:lab,Values=L02 \\
  --query "length(Subnets)"                      # expect 9
aws ec2 describe-subnets --filters Name=tag:lab,Values=L02 \\
  --query "Subnets[].AvailableIpAddressCount" --output text   # expect only 251 and 4091 values</code></pre>`,
  cleanup: `
<p>Only step 10 created resources (all free). Delete them so they don't clutter later labs:</p>
<pre><code>VPC=$(aws ec2 describe-vpcs --filters Name=tag:lab,Values=L02 --query "Vpcs[0].VpcId" --output text)
for s in $(aws ec2 describe-subnets --filters Name=vpc-id,Values=$VPC --query "Subnets[].SubnetId" --output text); do
  aws ec2 delete-subnet --subnet-id $s
done
aws ec2 delete-vpc --vpc-id $VPC
aws ec2 describe-vpcs --filters Name=tag:lab,Values=L02 --query "length(Vpcs)"   # expect 0</code></pre>
<p>If <code>delete-vpc</code> reports a <code>DependencyViolation</code>, something else is still inside the VPC (for example an internet gateway or security group you added). Delete it first. The default security group and main route table are removed automatically with the VPC.</p>`
};

/* ================================================================== MODULE QUIZ */
var QUIZ = {
  passMark: 70,
  questions: [
    { id: "M02-Q01", type: "single", domain: "D3", task: "3.4", level: 200,
      stem: "A web application must send requests for <code>/api/*</code> to one fleet of instances and <code>/images/*</code> to another, behind a single DNS name. Which load balancer meets this requirement?",
      options: [
        { t: "Application Load Balancer with path-based listener rules", c: true, why: "ALB works at Layer 7, so it can read the HTTP path and route to different target groups." },
        { t: "Network Load Balancer with two target groups", c: false, why: "NLB works at Layer 4 (TCP/UDP/TLS). It never parses the HTTP request, so it cannot route by path." },
        { t: "Gateway Load Balancer", c: false, why: "GWLB inserts Layer 3 virtual appliances (firewalls, IDS) into the traffic path. It doesn't route by URL." },
        { t: "Route 53 weighted records pointing to both fleets", c: false, why: "DNS resolves a hostname to addresses. It never sees the URL path." }
      ] },
    { id: "M02-Q02", type: "single", domain: "D3", task: "3.4", level: 200,
      stem: "A multiplayer game uses a custom UDP protocol. It needs a load balancer that handles millions of packets per second and gives clients one static IP address per AZ to allow-list. Which option meets these requirements?",
      options: [
        { t: "Network Load Balancer with UDP listeners", c: true, why: "NLB supports UDP at Layer 4 with very high throughput, and provides a static IP (or an Elastic IP you choose) per AZ." },
        { t: "Application Load Balancer", c: false, why: "ALB supports only HTTP, HTTPS and gRPC, not UDP, and its IP addresses change over time." },
        { t: "Amazon CloudFront distribution", c: false, why: "CloudFront is an HTTP(S) CDN. It doesn't proxy a custom UDP protocol." },
        { t: "Amazon API Gateway", c: false, why: "API Gateway handles HTTP/REST/WebSocket APIs, not raw UDP." }
      ] },
    { id: "M02-Q03", type: "single", domain: "D2", task: "2.2", level: 100,
      stem: "A subnet in a VPC has the CIDR block <code>10.0.5.0/24</code>. How many IP addresses can be assigned to network interfaces in this subnet?",
      options: [
        { t: "251", c: true, why: "256 addresses minus the 5 that AWS reserves in every subnet (network, VPC router, DNS, future use, broadcast)." },
        { t: "256", c: false, why: "That is the total size of a /24. AWS reserves 5 of these." },
        { t: "254", c: false, why: "That is the traditional count (minus network and broadcast). AWS reserves 3 more." },
        { t: "250", c: false, why: "AWS reserves exactly 5 addresses, not 6." }
      ] },
    { id: "M02-Q04", type: "single", domain: "D2", task: "2.1", level: 200,
      stem: "A containerised platform assigns a VPC IP address to every task. The team expects up to 1,500 tasks per AZ and wants the SMALLEST subnet in each AZ that fits. Which prefix should they use?",
      options: [
        { t: "/21", c: true, why: "A /21 has 2,048 addresses, so 2,043 are usable after the 5 AWS reserved addresses. That is enough for 1,500 tasks, and it is the smallest size that is." },
        { t: "/22", c: false, why: "A /22 has 1,024 − 5 = 1,019 usable addresses, which is too few." },
        { t: "/20", c: false, why: "A /20 fits (4,091 usable) but it is not the smallest size that fits." },
        { t: "/16", c: false, why: "A VPC itself can be at most /16. A /16 subnet would use the whole VPC and wastes space." }
      ] },
    { id: "M02-Q05", type: "multi", domain: "D2", task: "2.2", level: 200,
      stem: "A company's on-premises network uses <code>10.0.0.0/8</code> and is connected to an existing VPC <code>172.16.0.0/16</code>. A new VPC must later be routed to both without address conflicts. Which CIDR blocks are valid choices for the new VPC?",
      options: [
        { t: "<code>172.17.0.0/16</code>", c: true, why: "It is RFC 1918 private space (inside 172.16.0.0/12) and does not overlap 10.0.0.0/8 or 172.16.0.0/16." },
        { t: "<code>192.168.0.0/16</code>", c: true, why: "It is private, a valid VPC size, and doesn't overlap either network." },
        { t: "<code>10.200.0.0/16</code>", c: false, why: "It falls inside the on-premises 10.0.0.0/8, so the routes would conflict." },
        { t: "<code>172.16.128.0/17</code>", c: false, why: "It overlaps the existing VPC 172.16.0.0/16." },
        { t: "<code>100.64.0.0/10</code>", c: false, why: "VPC CIDR blocks must be between /16 and /28, so a /10 is not allowed." }
      ] },
    { id: "M02-Q06", type: "multi", domain: "D1", task: "1.2", level: 200,
      stem: "EC2 instances in private subnets must download OS updates from the internet. The instances must not accept connections that start from the internet, and the solution should have the LEAST operational overhead. Which steps should a solutions architect take?",
      options: [
        { t: "Create a NAT gateway in a public subnet", c: true, why: "A managed NAT gateway translates outbound traffic to its Elastic IP and allows only return traffic back in. AWS manages its scaling and availability within the AZ." },
        { t: "Add a <code>0.0.0.0/0</code> route to the NAT gateway in the private subnets' route table", c: true, why: "Without this default route, traffic from the private subnets never reaches the NAT gateway." },
        { t: "Add a <code>0.0.0.0/0</code> route to the internet gateway in the private subnets' route table", c: false, why: "That would make the subnets public, and the instances would need public IPs, which exposes them." },
        { t: "Assign an Elastic IP address to each private instance", c: false, why: "That makes each instance reachable from the internet, which violates the requirement." },
        { t: "Launch a NAT instance on EC2 in each private subnet", c: false, why: "A NAT instance must be in a public subnet, and it adds patching, scaling and failover work. That is more overhead than a NAT gateway." }
      ] },
    { id: "M02-Q07", type: "single", domain: "D4", task: "4.4", level: 200,
      stem: "Instances in private subnets read several terabytes per day from Amazon S3 in the same Region through a NAT gateway. The NAT gateway's data-processing charges are high. What is the MOST cost-effective change?",
      options: [
        { t: "Create an S3 gateway VPC endpoint and add it to the private route tables", c: true, why: "Gateway endpoints for S3 (and DynamoDB) have no hourly or per-GB charge, and they keep the traffic off the NAT gateway." },
        { t: "Create an S3 interface endpoint (AWS PrivateLink)", c: false, why: "This works, but interface endpoints charge per hour per AZ plus per GB, so it is not the most cost-effective option." },
        { t: "Replace the NAT gateway with a larger NAT instance", c: false, why: "This adds operational work, the instance and data-transfer costs remain, and it's a single point of failure." },
        { t: "Move the instances to public subnets with public IPs", c: false, why: "This weakens security. S3 traffic should stay private, and the gateway endpoint is free anyway." }
      ] },
    { id: "M02-Q08", type: "single", domain: "D2", task: "2.2", level: 200,
      stem: "A VPC has private subnets in three AZs. They all route <code>0.0.0.0/0</code> to a single NAT gateway in AZ-a. Outbound internet access must survive the failure of any single AZ. What should the architect do?",
      options: [
        { t: "Create a NAT gateway in a public subnet in each AZ, and give each AZ's private subnets their own route table pointing to their local NAT gateway", c: true, why: "A NAT gateway is redundant only within its own AZ. One per AZ, with AZ-local routing, removes the cross-AZ dependency. It also avoids cross-AZ data charges." },
        { t: "Enable the Multi-AZ option on the existing NAT gateway", c: false, why: "NAT gateways have no Multi-AZ option. They are zonal resources." },
        { t: "Create a second NAT gateway in AZ-a", c: false, why: "Both gateways would fail together if AZ-a fails." },
        { t: "Increase the NAT gateway's bandwidth", c: false, why: "NAT gateways scale automatically. Capacity has nothing to do with AZ failure." }
      ] },
    { id: "M02-Q09", type: "single", domain: "D2", task: "2.2", level: 200,
      stem: "A company hosts <code>example.com</code> in Amazon Route 53. Users must reach an Application Load Balancer by typing the bare domain <code>example.com</code>. Which record should be created?",
      options: [
        { t: "An alias A record at the zone apex targeting the ALB", c: true, why: "Alias records can sit at the zone apex, follow the ALB's changing IP addresses automatically, and queries to alias records for AWS resources are free." },
        { t: "A CNAME record at the zone apex pointing to the ALB DNS name", c: false, why: "DNS forbids a CNAME at the zone apex, because the apex must also hold SOA and NS records." },
        { t: "An A record listing the ALB's current IP addresses", c: false, why: "ALB IP addresses change as it scales, so the record would go stale and users would fail to connect." },
        { t: "An NS record delegating <code>example.com</code> to the ALB", c: false, why: "NS records delegate to name servers. An ALB is not a DNS server." }
      ] },
    { id: "M02-Q10", type: "single", domain: "D2", task: "2.1", level: 200,
      stem: "A DNS record that points to an on-premises web server has a TTL of 86,400 seconds. Next week traffic must move to a new AWS endpoint, and clients should switch within minutes of the change. What should the team do?",
      options: [
        { t: "At least one day before the migration, lower the record's TTL (for example to 60 seconds). Then update the value at cut-over.", c: true, why: "Resolvers cache the record for the old TTL. Lowering it a full old-TTL in advance means that by cut-over, caches hold the record for 60 s at most." },
        { t: "Lower the TTL and change the value at the same moment during the cut-over", c: false, why: "Resolvers that already cached the old record keep it for up to 24 hours, because they don't see the new TTL until their cache expires." },
        { t: "Raise the TTL to 172,800 seconds to reduce DNS load during the migration", c: false, why: "A longer TTL makes clients switch even more slowly." },
        { t: "Change the A record to a CNAME", c: false, why: "The record type doesn't matter here. Cached data and TTL are what control the switchover speed." }
      ] },
    { id: "M02-Q11", type: "multi", domain: "D3", task: "3.4", level: 200,
      stem: "Which statements about Amazon Route 53 alias records are correct?",
      options: [
        { t: "They can be created at the zone apex (for example <code>example.com</code>)", c: true, why: "This is the main advantage of alias records over CNAMEs." },
        { t: "Route 53 doesn't charge for queries to alias records that point to AWS resources such as ELB, CloudFront or S3 website endpoints", c: true, why: "Alias queries to AWS resources are free. CNAME queries are billed." },
        { t: "They can point to any external hostname on the internet", c: false, why: "Alias targets are specific AWS resources or other records in the same hosted zone. Use a CNAME for arbitrary external names." },
        { t: "You must set a TTL on an alias record that points to a load balancer", c: false, why: "You can't set a TTL on an alias record. Route 53 uses the target's TTL." },
        { t: "Resolvers receive a special record type called ALIAS", c: false, why: "Alias is internal to Route 53. Clients receive ordinary A or AAAA answers." }
      ] },
    { id: "M02-Q12", type: "single", domain: "D1", task: "1.3", level: 200,
      stem: "A public website runs behind an Application Load Balancer. It must use HTTPS with a trusted certificate that renews automatically, with the LEAST operational overhead. What should the architect do?",
      options: [
        { t: "Request a public certificate in AWS Certificate Manager (ACM) and attach it to an HTTPS listener on the ALB", c: true, why: "ACM public certificates are free and renew automatically while they are in use by integrated services such as ALB." },
        { t: "Buy a certificate from a third-party CA and import it into ACM", c: false, why: "Imported certificates do not renew automatically. You must re-import them before they expire." },
        { t: "Install a certificate on every EC2 instance and use an NLB with TCP passthrough", c: false, why: "This means managing certificates on every server and renewing them yourself, which is high overhead." },
        { t: "Use a self-signed certificate on the ALB", c: false, why: "Browsers don't trust self-signed certificates, so users would see security warnings." }
      ] },
    { id: "M02-Q13", type: "single", domain: "D1", task: "1.3", level: 300,
      stem: "A compliance rule requires data in transit to be encrypted all the way to the application instances. The application also needs host-based routing at the load balancer. Which design meets both requirements?",
      options: [
        { t: "An ALB with an HTTPS listener and HTTPS target groups, so traffic is re-encrypted to the instances", c: true, why: "The ALB terminates TLS to read the host header, then opens a new TLS connection to the targets, so the traffic is encrypted on both legs." },
        { t: "An ALB with an HTTPS listener and HTTP target groups", c: false, why: "Traffic between the ALB and the instances would be plaintext, which breaks the end-to-end requirement." },
        { t: "An NLB with a TCP listener on 443 passing TLS through to the instances", c: false, why: "This encrypts end to end, but an NLB can't read the host header, so host-based routing isn't possible." },
        { t: "CloudFront with an HTTP-only origin", c: false, why: "The CloudFront-to-origin leg would be unencrypted." }
      ] },
    { id: "M02-Q14", type: "single", domain: "D1", task: "1.2", level: 200,
      stem: "A security team needs to block a malicious IP range (<code>198.51.100.0/24</code>) from reaching any resource in a set of public subnets, enforced at the subnet boundary. What should they use?",
      options: [
        { t: "A network ACL inbound DENY rule for 198.51.100.0/24, numbered lower than the allow rules", c: true, why: "NACLs apply at the subnet level, support explicit deny rules, and are evaluated in rule-number order, so the deny must come before any allow." },
        { t: "A security group rule that denies 198.51.100.0/24", c: false, why: "Security groups support allow rules only. You cannot write a deny rule in a security group." },
        { t: "A route table entry for 198.51.100.0/24 pointing to a blackhole", c: false, why: "Routes match destinations of outbound traffic, not the sources of inbound requests." },
        { t: "Detach the internet gateway from the VPC", c: false, why: "That blocks all internet traffic, not just the malicious range." }
      ] },
    { id: "M02-Q15", type: "single", domain: "D1", task: "1.2", level: 300,
      stem: "Instances in a subnet can send HTTPS requests to the internet, but the responses never arrive. The subnet's network ACL allows outbound TCP 443 and inbound TCP 22 from the corporate range only. The security groups allow all outbound traffic. What fixes the problem?",
      options: [
        { t: "Add an inbound NACL rule allowing TCP 1024–65535 from 0.0.0.0/0", c: true, why: "NACLs are stateless. The responses return to the client's ephemeral port, so the NACL must allow that inbound range explicitly." },
        { t: "Add an inbound NACL rule allowing TCP 443 from 0.0.0.0/0", c: false, why: "Responses arrive on the instance's ephemeral source port, not on 443. Inbound 443 matters only for servers." },
        { t: "Add an inbound security group rule allowing TCP 443", c: false, why: "Security groups are stateful, so return traffic for outbound connections is already allowed. The NACL is what blocks it." },
        { t: "Add an outbound NACL rule allowing TCP 1024–65535", c: false, why: "That direction is irrelevant here. The responses are inbound." }
      ] },
    { id: "M02-Q16", type: "multi", domain: "D1", task: "1.2", level: 200,
      stem: "Which statements about security groups are correct?",
      options: [
        { t: "They are stateful: return traffic for an allowed connection is automatically allowed", c: true, why: "The security group tracks the connection, so you don't need a rule for the reply." },
        { t: "A rule can reference another security group as its source", c: true, why: "For example, \"allow 3306 from app-sg\". This lets tiers follow instances as they scale, without IP lists." },
        { t: "They support explicit deny rules", c: false, why: "Security groups support allow rules only. Use NACLs or AWS WAF to deny traffic." },
        { t: "Rules are evaluated in numbered order and the first match wins", c: false, why: "That describes NACLs. Security groups evaluate all rules together." },
        { t: "They are attached to subnets", c: false, why: "Security groups attach to network interfaces (instances, ENIs). NACLs attach to subnets." }
      ] },
    { id: "M02-Q17", type: "single", domain: "D3", task: "3.4", level: 300,
      stem: "A global TCP-based game service runs in two Regions. Players need lower and more consistent latency, two static anycast IP addresses, and Regional failover in seconds that is not affected by DNS caching. Which service fits BEST?",
      options: [
        { t: "AWS Global Accelerator", c: true, why: "It provides static anycast IPs, brings traffic onto the AWS backbone at the nearest edge location, supports TCP and UDP, and fails over between endpoints without depending on DNS TTLs." },
        { t: "Amazon CloudFront", c: false, why: "CloudFront optimises HTTP(S) and caching. It isn't the fit for a non-HTTP game protocol that needs static IPs." },
        { t: "Route 53 latency-based routing", c: false, why: "This is DNS based, so failover depends on clients' cached records, and it provides no static anycast IPs." },
        { t: "A Network Load Balancer in each Region", c: false, why: "NLBs are Regional. On their own they don't give global anycast entry points or cross-Region failover." }
      ] },
    { id: "M02-Q18", type: "single", domain: "D3", task: "3.4", level: 200,
      stem: "A chat application keeps long-lived WebSocket connections. It must route <code>chat.example.com</code> and <code>admin.example.com</code> to different services behind one load balancer. Which choice is correct?",
      options: [
        { t: "Application Load Balancer with host-based rules", c: true, why: "ALB supports WebSockets (the HTTP Upgrade mechanism) natively and can route on the Host header." },
        { t: "Network Load Balancer, because WebSockets are a Layer 4 protocol", c: false, why: "WebSocket starts as an HTTP request and upgrades from there. An NLB can carry the TCP stream but can't route on the hostname." },
        { t: "Gateway Load Balancer", c: false, why: "GWLB is for inserting virtual network appliances, not for application routing." },
        { t: "Route 53 failover routing", c: false, why: "That's DNS failover, not a load balancer, and it doesn't do host-based routing to services." }
      ] },
    { id: "M02-Q19", type: "single", domain: "D2", task: "2.2", level: 200,
      stem: "A company needs an encrypted connection between its data centre and a VPC within a few days. Bandwidth needs are around 300 Mbps and cost must be minimal. Which solution meets these requirements?",
      options: [
        { t: "AWS Site-to-Site VPN", c: true, why: "It creates IPsec-encrypted tunnels over the internet, can be set up in hours, costs little, and each tunnel supports up to about 1.25 Gbps." },
        { t: "AWS Direct Connect dedicated connection", c: false, why: "It takes weeks to provision, costs more, and isn't encrypted by default." },
        { t: "VPC peering", c: false, why: "Peering connects two VPCs. It can't connect an on-premises network." },
        { t: "AWS Client VPN", c: false, why: "Client VPN is for individual users' devices, not site-to-site network connectivity." }
      ] },
    { id: "M02-Q20", type: "single", domain: "D2", task: "2.2", level: 300,
      stem: "An on-premises engineer configured only one of the two tunnels of an AWS Site-to-Site VPN connection. During scheduled AWS maintenance, connectivity was lost. What is the simplest way to prevent this?",
      options: [
        { t: "Configure both tunnels on the customer gateway device, ideally with BGP (dynamic routing) for automatic failover", c: true, why: "AWS provides two tunnels that end on different endpoints so that one can be maintained or fail while the other carries traffic. You only get that protection if both tunnels are up." },
        { t: "Replace the VPN with VPC peering", c: false, why: "Peering cannot connect an on-premises network to a VPC." },
        { t: "Ask AWS Support to stop maintenance on the tunnel", c: false, why: "Maintenance is expected. The design must tolerate one tunnel being down." },
        { t: "Increase the tunnel's MTU", c: false, why: "MTU affects packet fragmentation, not tunnel availability." }
      ] },
    { id: "M02-Q21", type: "multi", domain: "D3", task: "3.4", level: 200,
      stem: "Which AWS services act as <em>reverse proxies</em>? They receive client requests on behalf of backend servers and hide those servers from clients.",
      options: [
        { t: "Application Load Balancer", c: true, why: "It terminates client connections and forwards requests to targets the clients never connect to directly." },
        { t: "Amazon CloudFront", c: true, why: "It accepts requests at edge locations, serves cached content and fetches the rest from the origin on the client's behalf." },
        { t: "NAT gateway", c: false, why: "It translates outbound connections from private instances. It works on the client side (egress), not in front of servers." },
        { t: "A Squid proxy that EC2 instances use for outbound web access", c: false, why: "That is a forward proxy: it acts for clients reaching out, not for servers." },
        { t: "AWS Client VPN", c: false, why: "It is a remote-access VPN for users, not a proxy in front of servers." }
      ] },
    { id: "M02-Q22", type: "single", domain: "D1", task: "1.2", level: 300,
      stem: "Private instances may reach only <code>*.partner-api.com</code> over HTTPS. All other internet destinations must be blocked, and the partner's IP addresses change often. Which solution has the LEAST operational overhead?",
      options: [
        { t: "AWS Network Firewall with a stateful domain allow-list rule group in the egress path", c: true, why: "Network Firewall can filter HTTPS by domain name (using the TLS SNI), so the rule stays valid even when the partner's IP addresses change." },
        { t: "Security group outbound rules that list <code>*.partner-api.com</code>", c: false, why: "Security group rules accept IP ranges, prefix lists or security groups, never domain names." },
        { t: "Network ACL outbound rules updated with the partner's current IPs", c: false, why: "NACLs are IP-based. Updating them every time the IPs change is high overhead and error-prone." },
        { t: "A NAT gateway configured to allow only that domain", c: false, why: "A NAT gateway performs address translation only. It has no filtering rules." }
      ] },
    { id: "M02-Q23", type: "single", domain: "D1", task: "1.2", level: 200,
      stem: "A public application behind an ALB is being targeted by SQL injection and cross-site scripting attempts. Which service should be used to block these requests?",
      options: [
        { t: "AWS WAF with managed rule groups, associated with the ALB", c: true, why: "WAF inspects Layer 7 HTTP requests and has managed rules for SQLi and XSS." },
        { t: "AWS Shield Standard", c: false, why: "Shield Standard protects against network and transport-layer DDoS attacks (L3/L4). It doesn't inspect HTTP payloads." },
        { t: "Network ACL deny rules", c: false, why: "NACLs see only IPs, ports and protocols. They can't inspect the request content." },
        { t: "Amazon GuardDuty", c: false, why: "GuardDuty detects threats and raises findings. It doesn't block HTTP requests inline." }
      ] },
    { id: "M02-Q24", type: "multi", domain: "D3", task: "3.4", level: 200,
      stem: "Which of the following make decisions using Layer 7 (application-layer) information?",
      options: [
        { t: "Application Load Balancer", c: true, why: "It routes on the HTTP host, path, headers, query string and method." },
        { t: "AWS WAF", c: true, why: "It evaluates HTTP request components such as the URI, headers, body and cookies." },
        { t: "Network Load Balancer", c: false, why: "It works at Layer 4 (TCP/UDP/TLS), forwarding by IP and port." },
        { t: "Security groups", c: false, why: "They filter at Layers 3 and 4 by protocol, port and source or destination." },
        { t: "Gateway Load Balancer", c: false, why: "It works at Layer 3, forwarding IP packets to appliances using GENEVE encapsulation." }
      ] },
    { id: "M02-Q25", type: "single", domain: "D4", task: "4.4", level: 200,
      stem: "A nightly batch job copies several terabytes between two EC2 instances in the same VPC. The instances are in different Availability Zones. The job is not business-critical and can be rerun if it fails. What is the MOST cost-effective way to reduce data transfer charges?",
      options: [
        { t: "Run both instances in the same AZ and transfer over private IP addresses", c: true, why: "Data transfer within one AZ over private IPs is free. Cross-AZ transfer is charged in each direction." },
        { t: "Transfer data using the instances' public IP addresses", c: false, why: "Traffic over public IPs is billed at higher rates than private cross-AZ traffic." },
        { t: "Route the traffic through a NAT gateway", c: false, why: "This adds NAT data-processing charges on top of the transfer costs." },
        { t: "Create a VPC peering connection between the two instances", c: false, why: "Peering connects VPCs, not instances in the same VPC, and wouldn't remove cross-AZ charges." }
      ] }
  ]
};

  window.LMS_MODULES["M02"] = {
    summary: "The networking an architect must be fluent in before touching a VPC: how the layered models explain load balancers and firewalls, IPv4/IPv6 addressing and CIDR planning, how routing and NAT move packets, how DNS resolves names, how TCP/UDP/HTTP/TLS behave on the wire, and how VPNs, firewalls and proxies protect traffic. Every concept is mapped to the AWS service that implements it.",
    objectives: [
      "Use the OSI and TCP/IP models to classify network devices, protocols and AWS controls, and explain L4 vs L7 load balancing",
      "Perform CIDR and subnet calculations by hand and design a non-overlapping IP address plan for AWS VPCs",
      "Trace a packet through route tables, internet gateways and NAT, and predict the route chosen by longest-prefix match",
      "Explain DNS resolution and record types, and choose between CNAME and Route 53 alias records",
      "Describe TCP, UDP, HTTP/1.1–3, WebSockets, gRPC and TLS, and choose where to terminate TLS",
      "Compare stateful and stateless firewalls, VPN types and forward vs reverse proxies, and map each to AWS services"
    ],
    lessons: LESSONS,
    labs: [LAB_L02],
    quiz: QUIZ,
    flashcards: FLASHCARDS
  };
})();
