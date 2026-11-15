"""Seeds all extra tables in SQLite if they are empty."""
from app.db import session, init_db
from app.db_models import ProjectRow, ForumPostRow, ProjectSquadRow, PrepSessionRow, LibraryResourceRow
import datetime

def seed_all_tables():
    init_db()
    s = session()

    # 1. Seed Projects
    if s.query(ProjectRow).count() == 0:
        projects_seed = [
            ProjectRow(
                id="visionary-crm",
                title="VisionaryCRM - Enterprise Workflow Engine",
                tagline="Distributed microservices CRM orchestrating sales telemetry with zero-downtime replication.",
                category="Web",
                status="Validated",
                image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
                creator={"name": "Alex Mwansa", "role": "Distributed Systems Engineer", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"},
                tags=["React", "TypeScript", "FastAPI", "PostgreSQL", "Kafka"],
                problem="High-frequency telemetry ingestion created locking bottlenecks across relational sales tables during peak operational quarters.",
                solution="Architected an event-driven worker mesh utilizing Redis sliding-window queues and streaming bulk upserts into partitioned PostgreSQL.",
                key_features=["Asynchronous distributed job worker mesh", "Real-time SSE event pipeline", "99.98% benchmark uptime"],
                contribution="System Architecture, WebSocket ingestion engine, and Docker Compose orchestration.",
                technologies=["React 19", "Tailwind CSS", "Python 3.12", "FastAPI", "Redis", "PostgreSQL"],
                gallery=["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"],
                live_demo_url="https://visionary-crm.demo.geova.ai",
                github_url="https://github.com/alexmwansa/visionary-crm",
                created_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
            ),
            ProjectRow(
                id="ecotrack",
                title="EcoTrack - Real-Time Carbon Footprint Telemetry",
                tagline="Telemetry dashboard tracking institutional logistics emissions via live IoT feeds.",
                category="Data Science",
                status="Validated",
                image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
                creator={"name": "Sarah Jenkins", "role": "Data Systems Architect", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80"},
                tags=["Python", "PyTorch", "Streamlit", "SQL", "Docker"],
                problem="Logistics supply networks lack granular per-mile emissions data, causing inaccurate quarterly ESG filings.",
                solution="Developed rolling average emissions models trained on OBD-II fleet tracking data.",
                key_features=["Continuous inference pipeline", "Automated anomaly flags", "Exportable regulatory audit packages"],
                contribution="Feature extraction, regression model training, and analytical visualization components.",
                technologies=["Python", "Pandas", "Scikit-Learn", "PostgreSQL", "Grafana"],
                gallery=["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"],
                live_demo_url="https://ecotrack.demo.geova.ai",
                github_url="https://github.com/sarahjenkins/ecotrack",
                created_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
            ),
            ProjectRow(
                id="mediconnect",
                title="MediConnect - High-Contrast Clinical Portal",
                tagline="WCAG AAA compliant health portal designed for geriatric accessibility and low-bandwidth clinics.",
                category="Mobile",
                status="Validated",
                image="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
                creator={"name": "Marcus Chen", "role": "Lead Frontend Architect", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"},
                tags=["React Native", "TypeScript", "Accessibility", "Offline First"],
                problem="Elderly patients in bandwidth-constrained rural settings struggle with bloated, multi-step portals.",
                solution="Single-screen high contrast architecture operating with zero external telemetry and full SQLite local cache.",
                key_features=["Sub-100KB initial payload", "Screen-reader optimized DOM nodes", "Instant offline sync"],
                contribution="Frontend UI components, accessibility audits, and automated e2e testing.",
                technologies=["React", "TypeScript", "Tailwind CSS", "IndexedDB"],
                gallery=["https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80"],
                live_demo_url="https://mediconnect.demo.geova.ai",
                github_url="https://github.com/marcuschen/mediconnect",
                created_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
            )
        ]
        s.add_all(projects_seed)

    # 2. Seed Forum Posts
    if s.query(ForumPostRow).count() == 0:
        forum_seed = [
            ForumPostRow(
                id="p-1",
                author_id="usr-student-001",
                author="Alex Mwansa",
                author_avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
                role="Distributed Systems Engineer",
                category="Interview Debrief",
                title="Google L5 System Design Interview Experience & Key Takeaways (2026)",
                content="Just finished my on-site round for L5 Full Stack. They focused heavily on multi-region database sharding with consistency trade-offs (CAP theorem in practice) and rate-limiting sliding windows in Redis. Here is my exact approach...",
                tags=["System Design", "Google", "Distributed Systems"],
                upvotes=48,
                replies_count=14,
                time_ago="2 hours ago",
                created_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
            ),
            ForumPostRow(
                id="p-2",
                author_id="usr-student-002",
                author="Marcus Chen",
                author_avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
                role="AI / ML Engineer",
                category="System Design",
                title="How do you handle JWT revocation cleanly in microservices architecture?",
                content="Looking for best practices when dealing with short-lived access tokens vs refresh tokens stored in secure httpOnly cookies. Is Redis blacklist better or public key verification with short expiration?",
                tags=["Security", "JWT", "Microservices", "Auth"],
                upvotes=32,
                replies_count=9,
                time_ago="5 hours ago",
                created_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
            )
        ]
        s.add_all(forum_seed)

    # 3. Seed Project Squads
    if s.query(ProjectSquadRow).count() == 0:
        squads_seed = [
            ProjectSquadRow(
                id="squad-distributed-db",
                name="Distributed Consensus Engine",
                tagline="Building a Raft-compliant key-value store in Rust & TypeScript",
                icon="Layers",
                color="indigo",
                current_sprint="Sprint 4: Consensus Failover",
                progress_percentage=82,
                members=[
                    {"name": "Alex Mwansa", "role": "Lead Architect", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"},
                    {"name": "Sarah Jenkins", "role": "Systems Verification", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80"}
                ],
                tasks=[
                    {"id": "t-1", "title": "Implement Raft leader heartbeat timeout logic", "status": "completed", "priority": "high", "assignee": {"name": "Alex Mwansa", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"}},
                    {"id": "t-2", "title": "Fuzz testing network partition simulations", "status": "completed", "priority": "high", "assignee": {"name": "Sarah Jenkins", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80"}},
                    {"id": "t-3", "title": "Expose Prometheus telemetry endpoint for replica latency", "status": "in-progress", "priority": "medium", "assignee": {"name": "Alex Mwansa", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"}}
                ],
                created_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
            )
        ]
        s.add_all(squads_seed)

    # 4. Seed Prep Sessions
    if s.query(PrepSessionRow).count() == 0:
        prep_seed = [
            PrepSessionRow(
                id="session-1",
                date_month="OCT",
                date_day="24",
                title="Distributed Systems & Database Sharding Round",
                time_range="2:00 PM - 3:15 PM",
                type="technical",
                link_available=True,
                created_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
            ),
            PrepSessionRow(
                id="session-2",
                date_month="OCT",
                date_day="28",
                title="Cross-Functional Conflict & Leadership Behavioral",
                time_range="10:00 AM - 10:45 AM",
                type="behavioral",
                link_available=False,
                created_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
            )
        ]
        s.add_all(prep_seed)

    # 5. Seed Library Resources
    if s.query(LibraryResourceRow).count() == 0:
        resources_seed = [
            LibraryResourceRow(
                id="res-1",
                section="technical",
                category="System Architecture",
                title="Consistent Hashing & Virtual Nodes Masterclass",
                duration="22 mins",
                completed=True,
                image="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
                created_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
            ),
            LibraryResourceRow(
                id="res-2",
                section="technical",
                category="Concurrency",
                title="Optimistic Locking vs Pessimistic Locking under Load",
                duration="18 mins",
                completed=False,
                image="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
                created_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
            ),
            LibraryResourceRow(
                id="res-3",
                section="behavioral",
                category="STAR Framework",
                title="Structuring High-Impact Conflict Resolution Stories",
                duration="15 mins",
                completed=True,
                image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
                created_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
            )
        ]
        s.add_all(resources_seed)

    s.commit()

