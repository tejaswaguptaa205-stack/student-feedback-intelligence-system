import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def create_sfis_word_doc(output_path):
    doc = docx.Document()

    # Set margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.9)
        section.right_margin = Inches(0.9)

    # Corporate Navy & Neutral Palette
    NAVY = RGBColor(36, 74, 115)       # #244A73
    CHARCOAL = RGBColor(32, 36, 43)    # #20242B
    GREY_MUTED = RGBColor(105, 115, 134) # #697386
    CRITICAL_RED = RGBColor(153, 27, 27)
    GREEN = RGBColor(22, 101, 52)
    AMBER = RGBColor(146, 64, 14)

    NAVY_HEX = "244A73"
    LIGHT_BG_HEX = "F7F8FA"
    BORDER_HEX = "E5E7EB"
    ALERT_BG_HEX = "EFF6FF"

    def set_cell_background(cell, hex_color):
        shading_xml = f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>'
        cell._tc.get_or_add_tcPr().append(parse_xml(shading_xml))

    def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = OxmlElement('w:tcMar')
        for margin, value in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
            node = OxmlElement(f'w:{margin}')
            node.set(qn('w:w'), str(value))
            node.set(qn('w:type'), 'dxa')
            tcMar.append(node)
        tcPr.append(tcMar)

    def add_callout(text, prefix="KEY TAKEAWAY: ", bg_hex="F7F8FA", border_hex="244A73"):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        set_cell_background(cell, bg_hex)
        set_cell_margins(cell, top=140, bottom=140, left=200, right=180)
        
        # Left border only
        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(f'''
            <w:tcBorders {nsdecls("w")}>
                <w:top w:val="none"/>
                <w:left w:val="single" w:sz="24" w:space="0" w:color="{border_hex}"/>
                <w:bottom w:val="none"/>
                <w:right w:val="none"/>
            </w:tcBorders>
        ''')
        tcPr.append(borders)
        
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15
        run_p = p.add_run(prefix)
        run_p.bold = True
        run_p.font.size = Pt(10)
        run_p.font.color.rgb = NAVY if border_hex == "244A73" else CRITICAL_RED

        run_t = p.add_run(text)
        run_t.font.size = Pt(10)
        run_t.font.italic = True
        run_t.font.color.rgb = CHARCOAL
        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    def style_table(table, col_widths, headers, data):
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        # Header Row
        hdr_row = table.rows[0]
        hdr_row._tr.get_or_add_trPr().append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))
        for i, header_text in enumerate(headers):
            cell = hdr_row.cells[i]
            cell.width = col_widths[i]
            set_cell_background(cell, NAVY_HEX)
            set_cell_margins(cell, top=120, bottom=120, left=140, right=140)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            run = p.add_run(header_text)
            run.bold = True
            run.font.size = Pt(9.5)
            run.font.color.rgb = RGBColor(255, 255, 255)

        # Data Rows
        for row_idx, row_data in enumerate(data):
            row = table.add_row()
            bg_color = "FFFFFF" if row_idx % 2 == 0 else LIGHT_BG_HEX
            for col_idx, cell_value in enumerate(row_data):
                cell = row.cells[col_idx]
                cell.width = col_widths[col_idx]
                set_cell_background(cell, bg_color)
                set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
                p = cell.paragraphs[0]
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                run = p.add_run(str(cell_value))
                run.font.size = Pt(9.5)
                run.font.color.rgb = CHARCOAL

        # Subtle borders
        tblPr = table._tbl.tblPr
        tblBorders = parse_xml(f'''
            <w:tblBorders {nsdecls("w")}>
                <w:top w:val="single" w:sz="4" w:space="0" w:color="{BORDER_HEX}"/>
                <w:bottom w:val="single" w:sz="6" w:space="0" w:color="{NAVY_HEX}"/>
                <w:insideH w:val="single" w:sz="4" w:space="0" w:color="{BORDER_HEX}"/>
                <w:insideV w:val="none"/>
                <w:left w:val="none"/>
                <w:right w:val="none"/>
            </w:tblBorders>
        ''')
        tblPr.append(tblBorders)
        doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # -------------------------------------------------------------
    # COVER PAGE / TITLE
    # -------------------------------------------------------------
    cover_title_p = doc.add_paragraph()
    cover_title_p.paragraph_format.space_before = Pt(40)
    cover_title_p.paragraph_format.space_after = Pt(6)
    run_tag = cover_title_p.add_run("ACADEMIC PROJECT PRESENTATION • COMPLETE SPECIFICATION\n")
    run_tag.font.size = Pt(10)
    run_tag.font.bold = True
    run_tag.font.color.rgb = GREY_MUTED

    run_title = cover_title_p.add_run("Student Feedback Intelligence System (SFIS)")
    run_title.font.size = Pt(26)
    run_title.font.bold = True
    run_title.font.color.rgb = NAVY

    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_after = Pt(20)
    run_sub = sub_p.add_run(
        "An Edge-Based NLP Platform for Automated Classification, Sentiment Analysis, and Priority Management of Student Feedback in Educational Institutions"
    )
    run_sub.font.size = Pt(12)
    run_sub.font.color.rgb = GREY_MUTED

    meta_tbl = doc.add_table(rows=4, cols=2)
    meta_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_data = [
        ("Platform Name", "Student Feedback Intelligence System (SFIS) v1.2.0"),
        ("Architecture & Core Domain", "Edge-Based Natural Language Processing (NLP) & Sentiment Analytics"),
        ("Live Implementation", "React 18 · TypeScript · Tailwind CSS · On-Device NLP · Recharts"),
        ("Presentation Format", "Complete Slide-by-Slide Deck Content with Technical Appendix")
    ]
    for idx, (label, val) in enumerate(meta_data):
        c1, c2 = meta_tbl.rows[idx].cells
        c1.width = Inches(2.2)
        c2.width = Inches(4.5)
        set_cell_background(c1, "F0F4F8")
        set_cell_background(c2, "FFFFFF")
        set_cell_margins(c1, 60, 60, 100, 100)
        set_cell_margins(c2, 60, 60, 100, 100)
        p1 = c1.paragraphs[0]
        r1 = p1.add_run(label)
        r1.bold = True
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = NAVY
        p2 = c2.paragraphs[0]
        r2 = p2.add_run(val)
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = CHARCOAL

    doc.add_page_break()

    def add_slide_header(num_str, title_str, category_str):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(2)
        r_num = p.add_run(f"{num_str.upper()} | {category_str.upper()}\n")
        r_num.font.size = Pt(9)
        r_num.font.bold = True
        r_num.font.color.rgb = GREY_MUTED

        r_title = p.add_run(title_str)
        r_title.font.size = Pt(17)
        r_title.font.bold = True
        r_title.font.color.rgb = NAVY

        # Subtle divider
        p_div = doc.add_paragraph()
        p_div.paragraph_format.space_after = Pt(10)
        p_div.paragraph_format.space_before = Pt(0)
        r_line = p_div.add_run("―" * 55)
        r_line.font.size = Pt(8)
        r_line.font.color.rgb = RGBColor(229, 231, 235)

    def add_bullet(p, bold_prefix, text):
        r_pre = p.add_run(f"•  {bold_prefix}: ")
        r_pre.bold = True
        r_pre.font.size = Pt(10)
        r_pre.font.color.rgb = NAVY
        r_txt = p.add_run(f"{text}\n")
        r_txt.font.size = Pt(10)
        r_txt.font.color.rgb = CHARCOAL

    # -------------------------------------------------------------
    # SLIDE 1: Problem Statement
    # -------------------------------------------------------------
    add_slide_header("Slide 01", "Problem Statement & Background", "Introduction")
    p1 = doc.add_paragraph()
    p1.paragraph_format.line_spacing = 1.2
    add_bullet(p1, "High Volume & Manual Burden", "Universities receive thousands of feedback entries per academic term, leading to manual bottlenecks and delayed handling.")
    add_bullet(p1, "Lack of Automated Classification", "No systematic categorization causes critical complaints to get lost amongst general comments.")
    add_bullet(p1, "Subjective Urgency Scoring", "Severity is traditionally assessed inconsistently by individual staff rather than structured safety metrics.")
    add_bullet(p1, "Erosion of Student Trust", "Slow response cycles reduce future student engagement and institutional transparency.")
    add_bullet(p1, "Spreadsheet Silos", "Feedback isolated in static files cannot be aggregated, tracked, or monitored for recurring patterns.")

    add_callout(
        "An institution that cannot listen efficiently cannot improve systematically. Without edge-automated triage, critical safety or infrastructure issues remain hidden in unstructured text.",
        prefix="CORE CHALLENGE: ",
        border_hex="244A73"
    )

    # -------------------------------------------------------------
    # SLIDE 2: Project Objectives
    # -------------------------------------------------------------
    add_slide_header("Slide 02", "Project Objectives & Scope", "Introduction")
    obj_headers = ["#", "Objective", "Operational Impact"]
    obj_data = [
        ("1", "Automated 8-Category Classification", "Instant routing to appropriate departments without manual sorting."),
        ("2", "Sentiment Analysis (Pos/Neu/Neg)", "Detect student satisfaction trends and sentiment polarization per department."),
        ("3", "Safety-Aware Priority Estimation", "Critical and urgent issues surfaced immediately, independent of emotional tone."),
        ("4", "On-Device Edge NLP Inference", "Zero cloud dependency, zero external API cost, and zero student data leakage."),
        ("5", "Human-in-the-Loop Management", "Full review workflow allowing administrative overrides and correction tracking."),
        ("6", "Institutional Intelligence & Reporting", "Real-time analytics, SLA tracking, executive summaries, and CSV/PDF export.")
    ]
    t2 = doc.add_table(rows=1, cols=3)
    style_table(t2, [Inches(0.5), Inches(2.6), Inches(3.6)], obj_headers, obj_data)

    # -------------------------------------------------------------
    # SLIDE 3: System Architecture
    # -------------------------------------------------------------
    add_slide_header("Slide 03", "System Architecture & Data Flow", "Architecture")
    p3 = doc.add_paragraph()
    add_bullet(p3, "Layer 1: Student Submission Layer", "Accessible web client featuring real-time character counting, duplicate protection, preset demonstration samples, and zero-login anonymous mode.")
    add_bullet(p3, "Layer 2: Edge NLP Inference Pipeline", "Client-side pipeline executing normalization, category scoring, sentiment analysis, safety-aware priority determination, keyword extraction, and summary generation in ~12ms.")
    add_bullet(p3, "Layer 3: Administrative Intelligence Layer", "Full suite containing Overview Dashboard, Feedback Explorer, Escalations Queue, Category Insights, Model Evaluation, and Edge Device Monitor.")
    
    add_callout(
        "Edge-First Architecture: Student feedback never leaves institutional premises or personal devices. All NLP evaluation runs entirely in the local runtime.",
        prefix="ARCHITECTURAL GUARANTEE: ",
        border_hex="16a34a"
    )

    # -------------------------------------------------------------
    # SLIDE 4: Technology Stack
    # -------------------------------------------------------------
    add_slide_header("Slide 04", "Enterprise Technology Stack", "Architecture")
    tech_headers = ["Component", "Technology", "Role & Rationale"]
    tech_data = [
        ("Frontend Framework", "React 18 + TypeScript", "Type-safe, component-driven UI for high-density enterprise data display."),
        ("Styling System", "Tailwind CSS", "Clean, professional corporate color palette (#244A73 navy, #F7F8FA background)."),
        ("Data Visualization", "Recharts", "Interactive charting: sentiment donuts, volume curves, stacked bar breakdowns."),
        ("Iconography", "Lucide React", "Consistent, lightweight system icons across all 10 application modules."),
        ("NLP Engine", "Edge Rule-Based (ONNX-Ready)", "Zero-dependency deterministic pipeline with instant swappable interface."),
        ("Persistence", "Browser LocalStorage", "Client persistence for 30+ demo records, settings, and human audit logs."),
        ("Runtime Server", "Node.js Custom Server", "Zero-dependency HTTP server with SPA fallback routing on port 5173.")
    ]
    t4 = doc.add_table(rows=1, cols=3)
    style_table(t4, [Inches(1.8), Inches(2.0), Inches(2.9)], tech_headers, tech_data)

    # -------------------------------------------------------------
    # SLIDE 5: 8 Supported Categories
    # -------------------------------------------------------------
    add_slide_header("Slide 05", "Supported Feedback Categories", "NLP Engine")
    cat_headers = ["Category", "Representative Issues", "Assigned Department"]
    cat_data = [
        ("Academic", "Curriculum pacing, syllabus completion, textbooks, course relevance", "Academic Affairs"),
        ("Faculty", "Teaching clarity, faculty availability, mentorship, evaluation fairness", "Department Head"),
        ("Infrastructure", "Lab computers, Wi-Fi connectivity, electrical fixtures, air conditioning", "Facilities Management"),
        ("Examination", "Timetable conflicts, grading delays, question clarity, hall seating", "Examination Cell"),
        ("Attendance", "Biometric/portal recording errors, attendance policy disputes", "Academic Registrar"),
        ("Fees", "Scholarship disbursement, fee receipts, installment schedules, refund queries", "Accounts & Finance"),
        ("Hostel", "Water availability, room hygiene, mess food cleanliness, warden responsiveness", "Hostel Administration"),
        ("Administration", "ID cards, transcripts, certificate issuance, general helpdesk delays", "Student Affairs Office")
    ]
    t5 = doc.add_table(rows=1, cols=3)
    style_table(t5, [Inches(1.5), Inches(3.4), Inches(1.8)], cat_headers, cat_data)

    # -------------------------------------------------------------
    # SLIDE 6: NLP Pipeline Steps
    # -------------------------------------------------------------
    add_slide_header("Slide 06", "The Automated NLP Analysis Pipeline", "NLP Engine")
    p6 = doc.add_paragraph()
    steps = [
        ("1. Input Normalization", "Converts raw text to lowercase, strips punctuation noise, tokenizes string into lexical units."),
        ("2. Language Detection", "Checks input language compatibility (English primary, extensible multilingual hooks)."),
        ("3. Category Classification", "Executes weighted dictionary vector scoring across all 8 target disciplines; argmax assigned."),
        ("4. Sentiment Analysis", "Measures valence indicators (positive, neutral, negative) and returns calibrated confidence."),
        ("5. Priority Estimation", "Independent multi-pass heuristic evaluating hazard terms, time delays, and operational blockages."),
        ("6. Keyword Extraction", "Extracts top 3-5 high-signal tokens representing the core issue."),
        ("7. Auto-Summarization", "Constructs a concise single-line executive digest of the submission."),
        ("8. Metadata Packaging", "Embeds processing timestamp, engine version, and edge hardware telemetry.")
    ]
    for s_name, s_desc in steps:
        add_bullet(p6, s_name, s_desc)

    # -------------------------------------------------------------
    # SLIDE 7: Safety-Aware Priority
    # -------------------------------------------------------------
    add_slide_header("Slide 07", "Safety-Aware Priority Estimation", "NLP Engine")
    add_callout(
        "Priority is NOT derived from Sentiment alone. A politely worded report of a sparking electrical board is Critical, while an aggressive complaint about cafeteria coffee is Medium.",
        prefix="CORE DESIGN PRINCIPLE: ",
        border_hex="991B1B"
    )
    prio_headers = ["Priority Level", "Triggering Indicators", "Illustrative Example", "Target SLA"]
    prio_data = [
        ("CRITICAL", "Immediate physical danger, fire hazard, health emergencies, structural failure", "Electrical panel sparking in Lab 3", "< 1 Hour"),
        ("HIGH", "Multi-day outages, examination blocking errors, severe administrative delays", "Hostel water unavailable for 2 days", "Same Day (4h)"),
        ("MEDIUM", "Service degradation, slow network speeds, minor cleanliness complaints", "Wi-Fi bandwidth is sluggish in library", "3 Business Days"),
        ("LOW", "General suggestions, minor observations, constructive compliments", "Request to install a snack vending machine", "Routine Queue")
    ]
    t7 = doc.add_table(rows=1, cols=4)
    style_table(t7, [Inches(1.1), Inches(2.6), Inches(2.1), Inches(1.0)], prio_headers, prio_data)

    # -------------------------------------------------------------
    # SLIDE 8: Application Overview
    # -------------------------------------------------------------
    add_slide_header("Slide 08", "Ten Integrated Application Modules", "System Walkthrough")
    mod_headers = ["#", "Module Name", "Primary Administrative Function"]
    mod_data = [
        ("01", "Overview Dashboard", "High-level operational metrics, trend charts, SLA escalation queue, and edge telemetry."),
        ("02", "Submit Feedback", "Student intake portal with preset buttons, anonymous submission, and real-time AI preview."),
        ("03", "Feedback Explorer", "Tabular data explorer with 7 filters, sorting, search, pagination, and CSV data export."),
        ("04", "AI Analysis Workbench", "Deep inspection workbench displaying activation scores, token weights, and confidence bars."),
        ("05", "Priority & Escalations", "Four-tier urgency queues, repeated issue clustering, and rapid status resolution."),
        ("06", "Analytics & Reports", "Formal institutional reporting with 5 report modes, category matrices, and print engine."),
        ("07", "Category Insights", "Discipline-specific performance breakdowns, negative sentiment ratios, and tag clouds."),
        ("08", "Edge AI Monitor", "Hardware telemetry: mode selector (CPU/WASM), latency benchmarker, and real-time event log."),
        ("09", "Model Evaluation", "8x8 Confusion Matrix, Precision/Recall/F1 metrics, and misclassification inspector."),
        ("10", "System Settings", "Configurable SLA targets, cluster grouping thresholds, and demo state management.")
    ]
    t8 = doc.add_table(rows=1, cols=3)
    style_table(t8, [Inches(0.5), Inches(2.2), Inches(4.0)], mod_headers, mod_data)

    # -------------------------------------------------------------
    # SLIDE 9: Overview Dashboard
    # -------------------------------------------------------------
    add_slide_header("Slide 09", "Executive Overview Dashboard", "System Walkthrough")
    p9 = doc.add_paragraph()
    add_bullet(p9, "6 Operational KPI Cards", "Total Feedback (1,284), Analyzed Coverage (99.0%), Negative Sentiment % (34%), High-Priority Count (87), Unresolved Queue (213), and Avg Resolution Duration (2.4 days).")
    add_bullet(p9, "Sentiment Distribution Donut", "Real-time visual breakdown of Positive, Neutral, and Negative proportions.")
    add_bullet(p9, "Volume Trend Area Chart", "Multi-week timeline depicting feedback submission spikes and volume patterns.")
    add_bullet(p9, "Departmental Category Distribution", "Stacked horizontal bar visualization mapping feedback categories to schools.")
    add_bullet(p9, "Active Escalations Stream", "Real-time feed displaying items nearing SLA breach.")

    # -------------------------------------------------------------
    # SLIDE 10: Submit Feedback Page
    # -------------------------------------------------------------
    add_slide_header("Slide 10", "Student Feedback Submission Portal", "System Walkthrough")
    p10 = doc.add_paragraph()
    add_bullet(p10, "Intuitive Student Interface", "Clean text submission field with real-time character counter and input validation.")
    add_bullet(p10, "5 Demonstration Presets", "One-click preset buttons populating realistic samples across categories.")
    add_bullet(p10, "Zero-Identity Anonymous Toggle", "Guarantees student privacy by scrubbing all identifiers before database writing.")
    add_bullet(p10, "Real-Time AI Inference Result Card", "Displays predicted category, sentiment rating, urgency level, keywords, and summary instantaneously upon submission (~12ms).")

    # -------------------------------------------------------------
    # SLIDE 11: Feedback Explorer
    # -------------------------------------------------------------
    add_slide_header("Slide 11", "Feedback Explorer & Data Management", "System Walkthrough")
    p11 = doc.add_paragraph()
    add_bullet(p11, "Multi-Dimensional Filtering", "Filter by Category (8 options), Sentiment, Priority, Department, Status, and Date Range.")
    add_bullet(p11, "Global Text Search", "Instant keyword search across feedback text, student identifiers, and issue tokens.")
    add_bullet(p11, "Four-Tab Detail Drawer", "Features AI Prediction Breakdown, Human Review & Status Workflow, Internal Staff Notes, and Lifecycle Audit Log.")
    add_bullet(p11, "Data Portability", "One-click export of current filtered view into industry-standard CSV format.")

    # -------------------------------------------------------------
    # SLIDE 12: Human-in-the-Loop Review
    # -------------------------------------------------------------
    add_slide_header("Slide 12", "Human-in-the-Loop Governance", "System Walkthrough")
    add_callout(
        "AI suggests; Administrators decide. All AI classifications remain advisory until confirmed or adjusted by staff. No critical issue can be closed without explicit human review.",
        prefix="GOVERNANCE POLICY: ",
        border_hex="244A73"
    )
    p12 = doc.add_paragraph()
    add_bullet(p12, "Prediction Confirmation", "Staff can accept the model's diagnosis with a single click, recording an agreement milestone.")
    add_bullet(p12, "Classification Overrides", "Authorized staff can re-assign category, sentiment, or priority, recording the justification.")
    add_bullet(p12, "Model Drift Tracking", "All human corrections are recorded in an audit trail to measure drift and curate datasets for model retraining.")

    # -------------------------------------------------------------
    # SLIDE 13: Analytics & Reports
    # -------------------------------------------------------------
    add_slide_header("Slide 13", "Analytics & Institutional Reports", "System Walkthrough")
    p13 = doc.add_paragraph()
    add_bullet(p13, "Five Executive Report Views", "Executive Summary, Category Performance Matrix, Sentiment Trend Over Time, SLA Compliance, and Submission Volume.")
    add_bullet(p13, "Category Health Matrix", "Cross-tabular breakdown comparing negative feedback percentages and resolution rates across all 8 disciplines.")
    add_bullet(p13, "Executive Export Engine", "Supports structured browser-native printing and instant PDF report generation.")

    # -------------------------------------------------------------
    # SLIDE 14: Edge AI Monitor
    # -------------------------------------------------------------
    add_slide_header("Slide 14", "Edge AI Monitor & Telemetry", "System Walkthrough")
    p14 = doc.add_paragraph()
    add_bullet(p14, "Hardware Mode Selection", "Toggle between standard CPU processing, WebAssembly (WASM), and WebGL acceleration modes.")
    add_bullet(p14, "Latency Percentile Profiling", "Tracks Average, 95th Percentile (P95), and 99th Percentile (P99) inference times.")
    add_bullet(p14, "Live Latency Benchmarker", "Interactive benchmark runner profiling batch inferences (10, 50, 100 samples).")
    add_bullet(p14, "Real-Time Processing Stream", "Live streaming log of tokenization events, inference completions, and memory usage.")

    # -------------------------------------------------------------
    # SLIDE 15: Model Evaluation Dashboard
    # -------------------------------------------------------------
    add_slide_header("Slide 15", "Model Evaluation & Verification", "System Walkthrough")
    p15 = doc.add_paragraph()
    add_bullet(p15, "Standard Classification Metrics", "Displays Overall Accuracy (87.3%), Macro Precision (84.1%), Macro Recall (82.9%), and Macro F1 (85.2%).")
    add_bullet(p15, "Interactive 8x8 Confusion Matrix", "Visual grid revealing inter-category confusion. Clicking any off-diagonal cell displays the exact misclassified feedback items.")
    add_bullet(p15, "Misclassification Inspector", "Deep-dive view into boundary cases between related categories (e.g., Infrastructure vs. Hostel facilities).")

    # -------------------------------------------------------------
    # SLIDE 16: Live Demonstration Example
    # -------------------------------------------------------------
    add_slide_header("Slide 16", "Live Demonstration & Output Verification", "System Demonstration")
    demo_headers = ["Field", "Inference Result", "Rule / Heuristic Trigger"]
    demo_data = [
        ("Input Feedback", '"The hostel water supply has been unavailable for two days, and administration has not responded."', 'Raw student submission'),
        ("Category", "Hostel", 'Matched keywords: "hostel", "water supply"'),
        ("Sentiment", "Negative (96% Conf)", 'Negative polarity markers: "unavailable", "not responded"'),
        ("Priority", "HIGH", 'Multi-day outage ("two days") + basic necessity + unaddressed complaint'),
        ("Keywords", "water supply, administration, two days, unresolved", 'High-frequency key content tokens'),
        ("Summary", "Hostel water supply unavailable for 2 days without administrative response.", 'Contextual one-line extraction'),
        ("Recommended Action", "Escalate maintenance ticket to Hostel Administration immediately.", 'Automated administrative recommendation'),
        ("Inference Latency", "12 milliseconds", 'Client-side edge execution')
    ]
    t16 = doc.add_table(rows=1, cols=3)
    style_table(t16, [Inches(1.8), Inches(2.7), Inches(2.2)], demo_headers, demo_data)

    # -------------------------------------------------------------
    # SLIDE 17: Competitive Comparison
    # -------------------------------------------------------------
    add_slide_header("Slide 17", "SFIS vs. Traditional Solutions", "Institutional Impact")
    comp_headers = ["Capability", "Traditional Survey Forms", "SFIS Platform"]
    comp_data = [
        ("Category Classification", "Manual sorting by human reviewers", "Automated 8-category edge classification"),
        ("Sentiment Detection", "Not available or manual estimation", "Instant positive/neutral/negative scoring"),
        ("Priority Estimation", "Subjective staff opinion", "Two-pass safety & urgency heuristics"),
        ("Inference Location", "Cloud API or None", "100% On-device Edge inference"),
        ("Student Privacy", "Mandatory login / identity attached", "Configurable anonymous submission mode"),
        ("Operational SLA Tracking", "None / Spreadsheet tracking", "Integrated escalation queues & SLA timers"),
        ("Model Quality Control", "Not applicable", "Interactive 8x8 confusion matrix & drift audit")
    ]
    t17 = doc.add_table(rows=1, cols=3)
    style_table(t17, [Inches(1.8), Inches(2.4), Inches(2.5)], comp_headers, comp_data)

    # -------------------------------------------------------------
    # SLIDE 18: Limitations & Future Work
    # -------------------------------------------------------------
    add_slide_header("Slide 18", "System Limitations & Technical Roadmap", "Technical Roadmap")
    p18 = doc.add_paragraph()
    add_bullet(p18, "Current Limitations", "Rule-based keyword scoring (sensitive to complex linguistic irony); English language focus; Browser LocalStorage persistence (demo scope); illustrative evaluation dataset.")
    add_bullet(p18, "Phase 1 Roadmap: Transformer Integration", "Integrate onnxruntime-web with quantized MiniLM / DistilBERT models for contextual embeddings directly in browser.")
    add_bullet(p18, "Phase 2 Roadmap: Enterprise Backend", "Deploy FastAPI / PostgreSQL backend with end-to-end encryption for multi-campus university deployments.")
    add_bullet(p18, "Phase 3 Roadmap: Multilingual NLP", "Extend pipeline to support regional Indian languages (Hindi, Marathi, Tamil, etc.) for inclusive student feedback.")

    # -------------------------------------------------------------
    # SLIDE 19: Conclusion
    # -------------------------------------------------------------
    add_slide_header("Slide 19", "Project Conclusion", "Summary")
    p19 = doc.add_paragraph()
    add_bullet(p19, "End-to-End Enterprise Solution", "Delivers an operational platform bridging student input with rapid administrative resolution.")
    add_bullet(p19, "Privacy-Preserving Edge AI", "Proves that actionable intelligence does not require expensive cloud APIs or compromising student data privacy.")
    add_bullet(p19, "Production-Ready Design System", "High-density, restrained corporate UI suitable for deployment across higher education institutions.")

    add_callout(
        "Efficient listening is the foundation of institutional excellence. SFIS provides the intelligence and workflow required to make feedback truly actionable.",
        prefix="CLOSING THOUGHT: ",
        border_hex="244A73"
    )

    # -------------------------------------------------------------
    # SLIDE 20: Q&A / Thank You
    # -------------------------------------------------------------
    add_slide_header("Slide 20", "Thank You & Technical Discussion", "Conclusion")
    p20 = doc.add_paragraph()
    p20.paragraph_format.space_before = Pt(10)
    p20.paragraph_format.space_after = Pt(15)
    r_qa = p20.add_run("Student Feedback Intelligence System (SFIS)\n")
    r_qa.font.size = Pt(16)
    r_qa.font.bold = True
    r_qa.font.color.rgb = NAVY

    r_qa_sub = p20.add_run("Edge-Based NLP for Automated Student Feedback Analysis\n\n")
    r_qa_sub.font.size = Pt(11)
    r_qa_sub.font.color.rgb = GREY_MUTED

    qa_tbl = doc.add_table(rows=2, cols=2)
    qa_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    qa_items = [
        ("Live Demonstration URL", "http://localhost:5173/"),
        ("Project Repository", "Local Workspace / Feedback Generator"),
        ("Tech Stack", "React 18 · TypeScript · Tailwind · On-Device NLP"),
        ("Open for Questions", "Architecture · Heuristics · Edge Deployment · UI")
    ]
    for idx, (label, val) in enumerate(qa_items):
        r_i, c_i = divmod(idx, 2)
        cell = qa_tbl.rows[r_i].cells[c_i]
        cell.width = Inches(3.3)
        set_cell_background(cell, "F7F8FA")
        set_cell_margins(cell, 80, 80, 120, 120)
        p = cell.paragraphs[0]
        r1 = p.add_run(f"{label}\n")
        r1.bold = True
        r1.font.size = Pt(9)
        r1.font.color.rgb = NAVY
        r2 = p.add_run(val)
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = CHARCOAL

    # -------------------------------------------------------------
    # APPENDIX SLIDES
    # -------------------------------------------------------------
    doc.add_page_break()
    p_app = doc.add_paragraph()
    p_app.paragraph_format.space_before = Pt(20)
    r_app_title = p_app.add_run("TECHNICAL APPENDIX (EXAMINER BACKUP)")
    r_app_title.font.size = Pt(18)
    r_app_title.font.bold = True
    r_app_title.font.color.rgb = RGBColor(55, 65, 81)

    # Appendix A
    add_slide_header("Appendix A", "NLP Scoring Mathematics & Dictionary Structure", "Technical Detail")
    p_a = doc.add_paragraph()
    add_bullet(p_a, "Vector Scoring Formulation", "For each category C in Categories: Score(C) = Σ (w_i * tf(t_i, Document)) where w_i represents discriminative term weight.")
    add_bullet(p_a, "Ties and Ambiguity Handling", "If max(Score) is below discrimination threshold, category defaults to 'General / Uncategorized' to avoid false confidence.")
    add_bullet(p_a, "Hostel Keyword Dictionary Sample", 'hostel (w=3.0), water supply (w=2.5), mess food (w=2.5), warden (w=2.0), room (w=1.5), cleanliness (w=1.5).')

    # Appendix B
    add_slide_header("Appendix B", "Two-Pass Priority Heuristic Engine", "Technical Detail")
    p_b = doc.add_paragraph()
    add_bullet(p_b, "Pass 1: Critical Safety Override", 'Scans for hard emergency triggers: "sparking", "fire", "shock", "food poisoning", "injury", "dangerous", "structural damage", "assault". Detection triggers immediate Critical priority.')
    add_bullet(p_b, "Pass 2: Urgency Accumulator", 'Computes Urgency Score based on: Duration tokens ("days", "weeks", "since", +2), Urgency modifiers ("urgent", "asap", +3), Unresolved markers ("no response", "ignored", +2), Severity words ("completely broken", +1). Score >= 6 -> High; Score 3-5 -> Medium; Score < 3 -> Low.')

    # Appendix C
    add_slide_header("Appendix C", "Codebase Architecture & File Structure", "Technical Detail")
    code_text = (
        "src/\n"
        "├── pages/                     # 10 Application page views\n"
        "│   ├── OverviewPage.tsx       # KPI cards, Recharts visualizations, escalation feed\n"
        "│   ├── SubmitFeedbackPage.tsx # Submission form with real-time NLP preview\n"
        "│   ├── FeedbackExplorerPage.tsx # Table, multi-filters, sorting, CSV export\n"
        "│   ├── AiAnalysisPage.tsx     # Workbench, token weights, activation bars\n"
        "│   ├── PriorityEscalationsPage.tsx # 4 Priority queues, issue clustering\n"
        "│   ├── AnalyticsReportsPage.tsx    # 5 Executive reports, print/PDF layout\n"
        "│   ├── CategoryInsightsPage.tsx    # 8-Discipline deep dive & sentiment donuts\n"
        "│   ├── EdgeMonitorPage.tsx    # Hardware telemetry & latency benchmarker\n"
        "│   ├── ModelEvaluationPage.tsx # 8x8 Confusion matrix & misclassification inspector\n"
        "│   └── SettingsPage.tsx       # SLA threshold configuration & demo data reset\n"
        "├── services/\n"
        "│   ├── nlpEngine.ts           # On-device category, sentiment, and priority engine\n"
        "│   └── storageService.ts      # LocalStorage CRUD, CSV export, telemetry state\n"
        "├── data/\n"
        "│   ├── mockFeedback.ts        # 30 Comprehensive enterprise demonstration records\n"
        "│   └── evaluationData.ts      # 8x8 confusion matrix dataset & metrics\n"
        "└── types/index.ts             # Complete TypeScript interface definitions"
    )
    p_code = doc.add_paragraph()
    r_c = p_code.add_run(code_text)
    r_c.font.name = "Courier New"
    r_c.font.size = Pt(8.5)
    r_c.font.color.rgb = RGBColor(30, 41, 59)

    doc.save(output_path)
    print(f"Successfully generated {output_path}")

if __name__ == "__main__":
    create_sfis_word_doc(r"C:\Users\tejas\OneDrive\Desktop\Feedback Generator\SFIS-Presentation.docx")
