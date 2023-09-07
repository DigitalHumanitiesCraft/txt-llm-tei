<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:t="http://www.tei-c.org/ns/1.0"
    exclude-result-prefixes="xs t"
    version="2.0">
    
    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="t:teiHeader"/>
    <xsl:template match="t:facsimile"/>
    <xsl:template match="t:text">
        <xsl:apply-templates/>
    </xsl:template>
    <xsl:template match="t:body">
        <xsl:apply-templates/>
    </xsl:template>
    
    <xsl:template match="t:div">
        <xsl:element name="di">
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:pb">
        <xsl:element name="pb">
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:p">
        <xsl:element name="p">
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:ref">
        <xsl:element name="r">
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:hi">
        <xsl:element name="hi">
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:foreign">
        <xsl:element name="fo">
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:dateline">
        <xsl:element name="dl">
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:opener">  
        <xsl:element name="o">
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:closer">  
        <xsl:element name="c">
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:salute">  
        <xsl:element name="s">
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:lb">  
        <xsl:element name="l"/>
    </xsl:template>
    
    <xsl:template match="t:signed">  
        <xsl:element name="s">
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:postscript">  
        <xsl:element name="ps">
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:bibl">  
        <xsl:element name="b">
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:note">  
        <xsl:element name="n">
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:persName">  
        <xsl:element name="pe">
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:placeName">  
        <xsl:element name="pl">
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:orgName">  
        <xsl:element name="pl">
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:date">  
        <xsl:element name="d">
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
</xsl:stylesheet>
