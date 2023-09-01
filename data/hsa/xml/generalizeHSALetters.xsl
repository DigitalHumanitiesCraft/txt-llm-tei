<?xml version="1.0" encoding="UTF-8"?>
<?xml-model href="hsa_schema.rng" type="application/xml" schematypens="http://relaxng.org/ns/structure/1.0"?>
<xsl:stylesheet xmlns="http://www.tei-c.org/ns/1.0"
                xmlns:tei="http://www.tei-c.org/ns/1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                version="2.0"
                exclude-result-prefixes="#all">
   <xsl:output encoding="UTF-8" method="xml" indent="yes"/>
   <!-- Insert the processing instruction at the top of the output -->
   <xsl:template match="/">
      <xsl:processing-instruction name="xml-model">href="hsa_schema.rng" type="application/xml" schematypens="http://relaxng.org/ns/structure/1.0"</xsl:processing-instruction>
      <xsl:apply-templates/>
   </xsl:template>
   <!-- Identity transform: copy all nodes and attributes as they are -->
   <xsl:template match="@*|node()">
      <xsl:copy>
         <xsl:apply-templates select="@*|node()"/>
      </xsl:copy>
   </xsl:template>
   <!-- Match and remove specific processing instructions -->
   <xsl:template match="processing-instruction('xml-model')"/>
   <!-- Match the teiHeader and replace it with a minimal version -->
   <xsl:template match="tei:teiHeader">
      <teiHeader>
         <fileDesc>
            <titleStmt>
               <title/>
            </titleStmt>
            <publicationStmt>
               <p>Publication Information</p>
            </publicationStmt>
            <sourceDesc>
               <p>Information about the source</p>
            </sourceDesc>
         </fileDesc>
      </teiHeader>
   </xsl:template>
   <!-- Match the graphic element and make it self-closing -->
   <xsl:template match="tei:graphic">
      <xsl:copy>
         <xsl:apply-templates select="@*[name() != 'url']"/>
         <xsl:attribute name="url">[pathtofile]</xsl:attribute>
         <xsl:text/>
      </xsl:copy>
   </xsl:template>
   <!-- Match any @ref attribute containing 'gams' and replace its value -->
   <xsl:template match="@ref[contains(., 'gams')]">
      <xsl:attribute name="ref">[authorityLink]</xsl:attribute>
   </xsl:template>
</xsl:stylesheet>
