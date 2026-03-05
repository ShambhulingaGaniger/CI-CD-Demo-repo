import { LightningElement } from 'lwc';

const PAGE_LEFT_X = 50;
const PAGE_TOP_Y = 760;
const PAGE_BOTTOM_Y = 50;
const LINE_HEIGHT = 14;
const MAX_WRAP_LENGTH = 95;

export default class ResumeBuilder extends LightningElement {
    personalInfo = {};
    summary = '';
    skills = [];
    educationList = [];
    workExperienceList = [];

    handlePersonalInfoUpdated(event) {
        this.personalInfo = event.detail;
    }

    handleSummaryUpdated(event) {
        this.summary = event.detail;
    }

    handleSkillsUpdated(event) {
        this.skills = event.detail;
    }

    handleEducationUpdated(event) {
        this.educationList = event.detail;
    }

    handleWorkUpdated(event) {
        this.workExperienceList = event.detail;
    }

    get summaryText() {
        return this.cleanText(this.summary);
    }

    get hasPersonalName() {
        return this.hasText(this.personalInfo.fullName);
    }

    get contactParts() {
        const parts = [];
        if (this.hasText(this.personalInfo.emailAddress)) {
            parts.push(this.cleanText(this.personalInfo.emailAddress));
        }
        if (this.hasText(this.personalInfo.phoneNumber)) {
            parts.push(this.cleanText(this.personalInfo.phoneNumber));
        }
        if (this.hasText(this.personalInfo.address)) {
            parts.push(this.cleanText(this.personalInfo.address));
        }
        return parts;
    }

    get hasContactInfo() {
        return this.contactParts.length > 0;
    }

    get formattedContactInfo() {
        return this.contactParts.join(' | ');
    }

    get filteredSkills() {
        return (this.skills || [])
            .filter((skill) => this.hasText(skill.name))
            .map((skill) => ({
                ...skill,
                name: this.cleanText(skill.name)
            }));
    }

    get filteredEducation() {
        return (this.educationList || [])
            .filter(
                (item) =>
                    this.hasText(item.degree) ||
                    this.hasText(item.institution) ||
                    this.hasText(item.year)
            )
            .map((item) => ({
                ...item,
                degree: this.cleanText(item.degree),
                institution: this.cleanText(item.institution),
                year: this.cleanText(item.year)
            }));
    }

    get workExperienceForView() {
        return (this.workExperienceList || [])
            .filter(
                (item) =>
                    this.hasText(item.jobTitle) ||
                    this.hasText(item.companyName) ||
                    this.hasText(item.location) ||
                    this.hasText(item.startDate) ||
                    this.hasText(item.endDate) ||
                    this.hasText(item.responsibilities)
            )
            .map((item) => {
                const jobTitle = this.cleanText(item.jobTitle);
                const companyName = this.cleanText(item.companyName);
                const displayTitle = [jobTitle, companyName].filter((value) => value).join(' - ');
                const location = this.cleanText(item.location);
                const dateRange = this.buildDateRange(item.startDate, item.endDate);
                const locationDateLine = [location, dateRange].filter((value) => value).join(' | ');
                const responsibilityLines = this.splitLines(item.responsibilities).map((line, index) => ({
                    id: `${item.id}-resp-${index}`,
                    text: line
                }));
                return {
                    ...item,
                    jobTitle,
                    companyName,
                    displayTitle,
                    location,
                    dateRange,
                    locationDateLine,
                    responsibilityLines
                };
            });
    }

    get hasSummary() {
        return this.summaryText.length > 0;
    }

    get hasEducation() {
        return this.filteredEducation.length > 0;
    }

    get hasSkills() {
        return this.filteredSkills.length > 0;
    }

    get hasWorkExperience() {
        return this.workExperienceForView.length > 0;
    }

    get hasAnySection() {
        return (
            this.hasPersonalName ||
            this.hasContactInfo ||
            this.hasSummary ||
            this.hasWorkExperience ||
            this.hasEducation ||
            this.hasSkills
        );
    }

    downloadPdf() {
        const lines = this.buildResumeLinesForPdf();
        if (!lines.length) {
            return;
        }

        const pdfBytes = this.createPdfDocument(lines);
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        const fileName = this.hasPersonalName
            ? this.cleanText(this.personalInfo.fullName).replace(/\s+/g, '_')
            : 'resume';

        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    buildResumeLinesForPdf() {
        const lines = [];

        if (this.hasPersonalName) {
            this.addWrappedText(lines, this.personalInfo.fullName);
        }

        if (this.hasContactInfo) {
            this.addWrappedText(lines, this.formattedContactInfo);
        }

        if (this.hasPersonalName || this.hasContactInfo) {
            lines.push('');
        }

        if (this.hasSummary) {
            lines.push('SUMMARY');
            this.addWrappedText(lines, this.summaryText);
            lines.push('');
        }

        if (this.hasSkills) {
            lines.push('SKILLS');
            this.addWrappedText(
                lines,
                this.filteredSkills.map((skill) => skill.name).join(', ')
            );
            lines.push('');
        }

        if (this.hasWorkExperience) {
            lines.push('WORK EXPERIENCE');
            this.workExperienceForView.forEach((work) => {
                if (work.displayTitle) {
                    this.addWrappedText(lines, work.displayTitle);
                }
                if (work.locationDateLine) {
                    this.addWrappedText(lines, work.locationDateLine);
                }
                work.responsibilityLines.forEach((line) => {
                    this.addWrappedText(lines, `- ${line.text}`);
                });
                if (!work.responsibilityLines.length && work.dateRange) {
                    this.addWrappedText(lines, work.dateRange);
                }
                lines.push('');
            });
        }

        if (this.hasEducation) {
            lines.push('EDUCATION');
            this.filteredEducation.forEach((education) => {
                if (education.degree) {
                    this.addWrappedText(lines, education.degree);
                }
                if (education.institution) {
                    this.addWrappedText(lines, education.institution);
                }
                if (education.year) {
                    this.addWrappedText(lines, `Year: ${education.year}`);
                }
                lines.push('');
            });
        }

        while (lines.length > 0 && lines[lines.length - 1] === '') {
            lines.pop();
        }

        return lines;
    }

    addWrappedText(lines, text) {
        this.wrapText(this.cleanText(text), MAX_WRAP_LENGTH).forEach((wrappedLine) => {
            lines.push(wrappedLine);
        });
    }

    wrapText(text, maxLength) {
        const cleanedText = this.toAscii(text);
        if (!cleanedText) {
            return [''];
        }

        const words = cleanedText.split(/\s+/);
        const wrapped = [];
        let currentLine = '';

        words.forEach((word) => {
            const nextLine = currentLine ? `${currentLine} ${word}` : word;
            if (nextLine.length <= maxLength) {
                currentLine = nextLine;
            } else {
                if (currentLine) {
                    wrapped.push(currentLine);
                }
                currentLine = word;
            }
        });

        if (currentLine) {
            wrapped.push(currentLine);
        }

        return wrapped;
    }

    createPdfDocument(lines) {
        const maxLinesPerPage = Math.floor((PAGE_TOP_Y - PAGE_BOTTOM_Y) / LINE_HEIGHT) + 1;
        const pages = [];
        let currentPage = [];

        lines.forEach((line) => {
            if (currentPage.length === maxLinesPerPage) {
                pages.push(currentPage);
                currentPage = [];
            }
            currentPage.push(this.toAscii(line));
        });

        if (currentPage.length) {
            pages.push(currentPage);
        }

        if (!pages.length) {
            pages.push(['']);
        }

        const objectBodies = [];
        const pageReferences = [];
        const firstPageObject = 3;
        const totalPages = pages.length;
        const fontObject = firstPageObject + totalPages * 2;

        objectBodies[1] = '<< /Type /Catalog /Pages 2 0 R >>';

        for (let index = 0; index < totalPages; index += 1) {
            const pageObject = firstPageObject + index * 2;
            const contentObject = pageObject + 1;
            pageReferences.push(`${pageObject} 0 R`);

            const contentStream = this.createContentStream(pages[index]);
            objectBodies[contentObject] =
                `<< /Length ${this.getByteLength(contentStream)} >>\n` +
                `stream\n${contentStream}\nendstream`;
            objectBodies[pageObject] =
                `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] ` +
                `/Resources << /Font << /F1 ${fontObject} 0 R >> >> ` +
                `/Contents ${contentObject} 0 R >>`;
        }

        objectBodies[2] = `<< /Type /Pages /Kids [${pageReferences.join(' ')}] /Count ${totalPages} >>`;
        objectBodies[fontObject] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';

        return this.buildPdfBytes(objectBodies, fontObject);
    }

    createContentStream(pageLines) {
        const commands = ['BT', '/F1 11 Tf', `${PAGE_LEFT_X} ${PAGE_TOP_Y} Td`];

        pageLines.forEach((line, index) => {
            commands.push(`(${this.escapePdfText(line)}) Tj`);
            if (index < pageLines.length - 1) {
                commands.push(`0 -${LINE_HEIGHT} Td`);
            }
        });

        commands.push('ET');
        return commands.join('\n');
    }

    buildPdfBytes(objectBodies, lastObjectNumber) {
        let pdf = '%PDF-1.4\n';
        const offsets = new Array(lastObjectNumber + 1).fill(0);

        for (let objectNumber = 1; objectNumber <= lastObjectNumber; objectNumber += 1) {
            offsets[objectNumber] = this.getByteLength(pdf);
            pdf += `${objectNumber} 0 obj\n${objectBodies[objectNumber]}\nendobj\n`;
        }

        const xrefOffset = this.getByteLength(pdf);
        pdf += `xref\n0 ${lastObjectNumber + 1}\n`;
        pdf += '0000000000 65535 f \n';

        for (let objectNumber = 1; objectNumber <= lastObjectNumber; objectNumber += 1) {
            pdf += `${String(offsets[objectNumber]).padStart(10, '0')} 00000 n \n`;
        }

        pdf += `trailer\n<< /Size ${lastObjectNumber + 1} /Root 1 0 R >>\n`;
        pdf += `startxref\n${xrefOffset}\n%%EOF`;
        return new TextEncoder().encode(pdf);
    }

    buildDateRange(startDate, endDate) {
        const start = this.cleanText(startDate);
        const end = this.cleanText(endDate);
        if (start && end) {
            return `${start} to ${end}`;
        }
        if (start) {
            return `From ${start}`;
        }
        if (end) {
            return `Until ${end}`;
        }
        return '';
    }

    escapePdfText(text) {
        return this.toAscii(text)
            .replace(/\\/g, '\\\\')
            .replace(/\(/g, '\\(')
            .replace(/\)/g, '\\)');
    }

    getByteLength(text) {
        return new TextEncoder().encode(text).length;
    }

    hasText(value) {
        return this.cleanText(value).length > 0;
    }

    cleanText(value) {
        if (value === undefined || value === null) {
            return '';
        }
        return String(value).trim();
    }

    splitLines(value) {
        const text = this.cleanText(value);
        if (!text) {
            return [];
        }

        return text
            .split(/\r?\n/)
            .map((line) => this.cleanText(line))
            .filter((line) => line.length > 0);
    }

    toAscii(value) {
        return this.cleanText(value).replace(/[^\x20-\x7E]/g, '');
    }
}